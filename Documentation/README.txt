To create the database using the project's structure, run 'update-database' in the Package Manager Console.
This will create a blank database, so you will need to add data using the ASP.NET admin site.

To access the admin site for the first time, follow these steps:
In RolesController.cs, temporarily comment out [Authorize(Roles = "Admin")].
Run the program and create an account using the "Register" button on the top right of the page.
Log in to the new account, then navigate to the "Roles" page.
Create two new roles named "Staff" and "Admin", then assign both to your account.
Uncomment the authorization line in RolesController.cs.
You should now have full access to the site as an admin user.