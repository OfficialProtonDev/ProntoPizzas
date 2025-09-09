using ProntoPizzas.Models;
using System.ComponentModel.DataAnnotations;

public class OrderProduct
{
    public Guid OrderId { get; set; }
    public Order? Order { get; set; }

    public Guid PizzaId { get; set; }
    public Product? Product { get; set; }

    [Required]
    public string? Size { get; set; }
    [Range(1, 100)]
    public int Quantity { get; set; }
}