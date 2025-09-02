using System.ComponentModel.DataAnnotations;

namespace ProntoPizzas.Models
{
    public class Customer
    {
        [Display(Name = "Customer ID")]
        public Guid CustomerId { get; set; }
        public string? Name { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
    }
}
