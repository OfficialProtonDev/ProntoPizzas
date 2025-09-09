using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProntoPizzas.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPizzaSizes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "Product");

            migrationBuilder.AddColumn<decimal>(
                name: "LargePrice",
                table: "Product",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "MediumPrice",
                table: "Product",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "SmallPrice",
                table: "Product",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "Size",
                table: "OrderProduct",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LargePrice",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "MediumPrice",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "SmallPrice",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "Size",
                table: "OrderProduct");

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Product",
                type: "decimal(18,2)",
                nullable: true);
        }
    }
}
