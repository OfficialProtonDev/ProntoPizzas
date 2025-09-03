using System.ComponentModel.DataAnnotations;

namespace ProntoPizzas.Models
{
    public class Order
    {
        [Display(Name = "Order ID")]
        public Guid OrderId { get; set; }

        [Display(Name = "Order Date")]
        public DateTime? OrderDate { get; set; }

        [Display(Name = "Customer")]
        public Guid CustomerName { get; set; }
        public string? Customer { get; set; }

        [Display(Name = "Delivery Address")]
        public string? DeliveryAddress { get; set; }

        [Display(Name = "Product")]
        public Guid ProductId { get; set; }
        public Product? Product { get; set; }

        [Display(Name = "Order Status")]
        public string? OrderStatus { get; set; }
    }
}
