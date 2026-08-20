using Microsoft.EntityFrameworkCore;
using EstoqueService.Data;

var builder = WebApplication.CreateBuilder(args);

// Adicione isto:
builder.Services.AddDbContext<EstoqueDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("EstoqueDb")));


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
builder.Services.AddControllers();          

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowAngular");
app.UseHttpsRedirection();
app.MapControllers();
app.Run();
