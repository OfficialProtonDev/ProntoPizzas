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
        public Guid CustomerId { get; set; }
        public Customer? Customer { get; set; }

        [Display(Name = "Product")]
        public Guid ProductId { get; set; }
        public Product? Product { get; set; }

        [Display(Name = "Staff")]
        public Guid StaffId { get; set; }
        public Staff? Staff { get; set; }
    }
}
