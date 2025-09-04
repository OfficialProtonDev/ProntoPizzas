using System.Collections.Generic;
using ProntoPizzas.Models;

namespace ProntoPizzas.Models
{
    public class OrderCreateViewModel
    {
        public Order Order { get; set; } = new Order();
        public List<Product> Products { get; set; } = new List<Product>();
        public List<OrderProduct> OrderProducts { get; set; } = new List<OrderProduct>();
    }
}