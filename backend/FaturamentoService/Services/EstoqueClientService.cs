using System.Text;
using System.Text.Json;

namespace FaturamentoService.Services
{
    public class EstoqueClientService
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public EstoqueClientService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public class BaixaEstoqueResult
        {
            public bool Sucesso { get; set; }
            public string? MensagemErro { get; set; }
        }

        public async Task<BaixaEstoqueResult> BaixarEstoqueAsync(int produtoId, int quantidade)
        {
            var client = _httpClientFactory.CreateClient("EstoqueService");

            var payload = new { produtoId, quantidade };
            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                var response = await client.PostAsync("api/produtos/baixar-estoque", content);

                if (response.IsSuccessStatusCode)
                    return new BaixaEstoqueResult { Sucesso = true };

                var body = await response.Content.ReadAsStringAsync();
                return new BaixaEstoqueResult
                {
                    Sucesso = false,
                    MensagemErro = $"Estoque recusou a operação: {body}"
                };
            }
            catch (Exception)
            {
                return new BaixaEstoqueResult
                {
                    Sucesso = false,
                    MensagemErro = "Não foi possível processar a nota. Serviço de Estoque indisponível. Tente novamente."
                };
            }
        }
    }
}