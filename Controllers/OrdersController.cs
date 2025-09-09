using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ProntoPizzas.Data;
using ProntoPizzas.Models;

namespace ProntoPizzas.Controllers
{
    public class OrdersController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Orders
        public async Task<IActionResult> Index()
        {
            var orders = await _context.Order
                .Include(o => o.OrderProducts)
                    .ThenInclude(op => op.Product)
                .ToListAsync();
            return View(orders);
        }

        // GET: Orders/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var order = await _context.Order
                .Include(o => o.OrderProducts)
                    .ThenInclude(op => op.Product)
                .FirstOrDefaultAsync(m => m.OrderId == id);
            if (order == null)
            {
                return NotFound();
            }

            return View(order);
        }

        // GET: Orders/Create
        public IActionResult Create()
        {
            var products = _context.Product.ToList();
            var viewModel = new OrderCreateViewModel
            {
                Products = products,
                OrderProducts = new List<OrderProduct> { new OrderProduct() },
                PizzaSelectList = new SelectList(products, "PizzaId", "PizzaName")
            };
            return View(viewModel);
        }

        // POST: Orders/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(OrderCreateViewModel viewModel)
        {
            var order = viewModel.Order;
            order.OrderId = Guid.NewGuid();

            var orderProducts = viewModel.OrderProducts
                .Where(op => op.Quantity > 0)
                .Select(op => new OrderProduct
                 {
                    OrderId = order.OrderId,
                    PizzaId = op.PizzaId,
                    Size = op.Size,
                    Quantity = op.Quantity
                 }).ToList();

            order.OrderProducts = orderProducts;

            _context.Order.Add(order);
            _context.OrderProduct.AddRange(orderProducts);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));

            viewModel.PizzaSelectList = new SelectList(_context.Product, "PizzaId", "PizzaName");
            return View(viewModel);
        }

        // GET: Orders/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null)
                return NotFound();

            var order = await _context.Order
                .Include(o => o.OrderProducts)
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null)
                return NotFound();

            var products = await _context.Product.ToListAsync();

            var orderProducts = order.OrderProducts
                .Select(op => new OrderProduct
                {
                    OrderId = order.OrderId,
                    PizzaId = op.PizzaId,
                    Size = op.Size,
                    Quantity = op.Quantity
                }).ToList();

            if (orderProducts.Count == 0)
                orderProducts.Add(new OrderProduct());

            var viewModel = new OrderCreateViewModel
            {
                Order = order,
                Products = products,
                OrderProducts = orderProducts,
                PizzaSelectList = new SelectList(products, "PizzaId", "PizzaName")
            };

            return View(viewModel);
        }

        // POST: Orders/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, OrderCreateViewModel viewModel)
        {
            if (id != viewModel.Order.OrderId)
                return NotFound();

            var order = await _context.Order
                    .Include(o => o.OrderProducts)
                    .FirstOrDefaultAsync(o => o.OrderId == id);

                if (order == null)
                    return NotFound();

                // Update order fields
                order.OrderDate = viewModel.Order.OrderDate;
                order.CustomerName = viewModel.Order.CustomerName;
                order.DeliveryAddress = viewModel.Order.DeliveryAddress;
                order.OrderStatus = viewModel.Order.OrderStatus;

                // Remove old products
                _context.OrderProduct.RemoveRange(order.OrderProducts);

                // Add new products with quantity > 0
                order.OrderProducts = viewModel.OrderProducts
                    .Where(op => op.Quantity > 0)
                    .Select(op => new OrderProduct
                    {
                        OrderId = order.OrderId,
                        PizzaId = op.PizzaId,
                        Size = op.Size,
                        Quantity = op.Quantity
                    })
                    .ToList();

                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));

            // Repopulate products for redisplay
            viewModel.Products = await _context.Product.ToListAsync();
            viewModel.PizzaSelectList = new SelectList(_context.Product, "PizzaId", "PizzaName");
            viewModel.Products = await _context.Product.ToListAsync();
            if (viewModel.OrderProducts == null || viewModel.OrderProducts.Count == 0)
                viewModel.OrderProducts = new List<OrderProduct> { new OrderProduct() };
            return View(viewModel);
        }

        // GET: Orders/Delete/5
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var order = await _context.Order
                .Include(o => o.OrderProducts)
                    .ThenInclude(op => op.Product)
                .FirstOrDefaultAsync(m => m.OrderId == id);
            if (order == null)
            {
                return NotFound();
            }

            return View(order);
        }

        // POST: Orders/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            var order = await _context.Order
                .Include(o => o.OrderProducts)
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order != null)
            {
                _context.Set<OrderProduct>().RemoveRange(order.OrderProducts);
                _context.Order.Remove(order);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool OrderExists(Guid id)
        {
            return _context.Order.Any(e => e.OrderId == id);
        }
    }
}
