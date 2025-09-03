using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;

namespace ProntoPizzas.Models
{
    public class RolesAssignViewModel
    {
        [Required]
        [Display(Name = "User")]
        public string SelectedUserName { get; set; }

        [Required]
        [Display(Name = "Role")]
        public string SelectedRoleName { get; set; }

        public SelectList Users { get; set; }
        public SelectList Roles { get; set; }
    }
}
