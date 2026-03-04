using Gyak;
using MySql.Data.MySqlClient;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var connection = new MySqlConnection(connectionString);

await connection.OpenAsync();

builder.Services.AddOpenApi();

var app = builder.Build();

app.MapGet("/all", async () =>
{
    var products = new List<Product>();
    var command = new MySqlCommand("SELECT * FROM Products", connection);
    using var reader = await command.ExecuteReaderAsync();
    while (await reader.ReadAsync())
    {
        products.Add(new Product
        {
            Id = reader.GetInt32(0),
            Name = reader.GetString(1),
            Price = reader.GetInt32(2),
            Stock = reader.GetInt32(3)
        });
    }
    return products;
});

app.MapPost("/create", async (Product candy) =>
{
    var command = new MySqlCommand("INSERT INTO Products ").;
});

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();


