using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProntoPizzas.Data.Migrations
{
    /// <inheritdoc />
    public partial class ProductIdToPizzaId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Order_Product_ProductId",
                table: "Order");

            migrationBuilder.DropIndex(
                name: "IX_Order_ProductId",
                table: "Order");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "Product",
                newName: "PizzaId");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "Order",
                newName: "PizzaId");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Order_Product_ProductPizzaId",
                table: "Order");

            migrationBuilder.DropIndex(
                name: "IX_Order_ProductPizzaId",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "ProductPizzaId",
                table: "Order");

            migrationBuilder.RenameColumn(
                name: "PizzaId",
                table: "Product",
                newName: "ProductId");

            migrationBuilder.RenameColumn(
                name: "PizzaId",
                table: "Order",
                newName: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Order_ProductId",
                table: "Order",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_Order_Product_ProductId",
                table: "Order",
                column: "ProductId",
                principalTable: "Product",
                principalColumn: "ProductId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
