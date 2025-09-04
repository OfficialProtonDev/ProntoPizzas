using ProntoPizzas.Models;

public class OrderProduct
{
    public Guid OrderId { get; set; }
    public Order? Order { get; set; }

    public Guid PizzaId { get; set; }
    public Product? Product { get; set; }

    public int Quantity { get; set; }
}