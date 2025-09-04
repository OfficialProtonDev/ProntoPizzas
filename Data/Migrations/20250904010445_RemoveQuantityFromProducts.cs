using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProntoPizzas.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveQuantityFromProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Product");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Product",
                type: "int",
                nullable: true);
        }
    }
}
