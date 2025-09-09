using Microsoft.AspNetCore.Mvc.Rendering;
using ProntoPizzas.Models;
using System.Collections.Generic;

namespace ProntoPizzas.Models
{
    public class OrderCreateViewModel
    {
        public Order Order { get; set; } = new Order();
        public List<Product> Products { get; set; } = new List<Product>();
        public List<OrderProduct> OrderProducts { get; set; } = new List<OrderProduct>();
        public SelectList PizzaSelectList { get; set; }
    }
}