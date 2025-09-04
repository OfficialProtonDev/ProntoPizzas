using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProntoPizzas.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderProductTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Order_Product_ProductPizzaId",
                table: "Order");

            migrationBuilder.DropIndex(
                name: "IX_Order_ProductPizzaId",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Customer",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "PizzaId",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "ProductPizzaId",
                table: "Order");

            migrationBuilder.AlterColumn<string>(
                name: "CustomerName",
                table: "Order",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.CreateTable(
                name: "OrderProduct",
                columns: table => new
                {
                    OrderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PizzaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderProduct", x => new { x.OrderId, x.PizzaId });
                    table.ForeignKey(
                        name: "FK_OrderProduct_Order_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Order",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderProduct_Product_PizzaId",
                        column: x => x.PizzaId,
                        principalTable: "Product",
                        principalColumn: "PizzaId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderProduct_PizzaId",
                table: "OrderProduct",
                column: "PizzaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderProduct");

            migrationBuilder.AlterColumn<Guid>(
                name: "CustomerName",
                table: "Order",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Customer",
                table: "Order",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "PizzaId",
                table: "Order",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "ProductPizzaId",
                table: "Order",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Order_ProductPizzaId",
                table: "Order",
                column: "ProductPizzaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Order_Product_ProductPizzaId",
                table: "Order",
                column: "ProductPizzaId",
                principalTable: "Product",
                principalColumn: "PizzaId");
        }
    }
}
