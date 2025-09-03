using Microsoft.AspNetCore.Identity;

namespace ProntoPizzas.Models
{
    public class RolesIndexViewModel
    {
        public List<IdentityRole> Roles { get; set; }
        public List<UserRolesViewModel> UserRoles { get; set; }
    }

}
