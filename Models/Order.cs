using System.ComponentModel.DataAnnotations;

namespace ProntoPizzas.Models
{
    public class Order
    {
        [Key]
        [Display(Name = "Order ID")]
        public Guid OrderId { get; set; }

        [Display(Name = "Order Date")]
        public DateTime? OrderDate { get; set; }

        [Display(Name = "Customer Name")]
        public string? CustomerName { get; set; }

        [Display(Name = "Delivery Address")]
        public string? DeliveryAddress { get; set; }

        [Display(Name = "Order Status")]
        public string? OrderStatus { get; set; }

        public ICollection<OrderProduct> OrderProducts { get; set; } = new List<OrderProduct>();
    }
}
