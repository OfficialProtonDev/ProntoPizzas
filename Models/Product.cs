using System.ComponentModel.DataAnnotations;

namespace ProntoPizzas.Models
{
    public class Product
    {
        [Key]
        [Display(Name = "Pizza ID")]
        public Guid PizzaId { get; set; }

        [Display(Name = "Pizza Name")]
        public string? PizzaName { get; set; }

        [Display(Name = "Pizza Description")]
        public string? PizzaDescription { get; set; }

        public string? Ingredients { get; set; }

        [Display(Name = "Image URL")]
        public string? ImageUrl { get; set; }

        [Display(Name = "Small Price")]
        public decimal SmallPrice { get; set; }

        [Display(Name = "Medium Price")]
        public decimal MediumPrice { get; set; }

        [Display(Name = "Large Price")]
        public decimal LargePrice { get; set; }

        public ICollection<OrderProduct> OrderProducts { get; set; } = new List<OrderProduct>();
    }
}
