using Microsoft.EntityFrameworkCore;
using FaturamentoService.Data;
using Polly;
using Polly.Extensions.Http;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<FaturamentoDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("FaturamentoDb")));
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient("EstoqueService", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["EstoqueServiceUrl"] ?? "http://localhost:5007/");
    client.Timeout = TimeSpan.FromSeconds(5);
})
.AddPolicyHandler(GetRetryPolicy());
builder.Services.AddScoped<FaturamentoService.Services.EstoqueClientService>();

static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
{
    return HttpPolicyExtensions
        .HandleTransientHttpError() // trata erros 5xx e falhas de rede
        .OrResult(msg => msg.StatusCode == System.Net.HttpStatusCode.RequestTimeout)
        .WaitAndRetryAsync(3, retryAttempt =>
            TimeSpan.FromSeconds(Math.Pow(2, retryAttempt))); // 2s, 4s, 8s
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowAngular");
app.UseHttpsRedirection();
app.MapControllers();
app.Run();