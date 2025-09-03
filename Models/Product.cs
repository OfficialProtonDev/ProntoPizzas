using System.ComponentModel.DataAnnotations;

namespace ProntoPizzas.Models
{
    public class Product
    {
        [Display(Name = "Pizza ID")]
        public Guid PizzaId { get; set; }

        [Display(Name = "Pizza Name")]
        public string? PizzaName { get; set; }

        [Display(Name = "Pizza Description")]
        public string? PizzaDescription { get; set; }

        public string? Ingredients { get; set; }

        [Display(Name = "Image URL")]
        public string? ImageUrl { get; set; }
        public decimal? Price { get; set; }
        public int? Quantity { get; set; }
    }
}
