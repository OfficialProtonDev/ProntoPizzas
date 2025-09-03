using Microsoft.AspNetCore.Identity;

namespace ProntoPizzas.Models
{
    public class UserRolesViewModel
    {
        public string UserName { get; set; }
        public List<string> Roles { get; set; }
        public bool HasRoles => Roles != null && Roles.Any();
        public int RoleCount => Roles?.Count ?? 0;
    }
}
