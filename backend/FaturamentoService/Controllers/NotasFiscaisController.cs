using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FaturamentoService.Data;
using FaturamentoService.Models;
using FaturamentoService.Services;

namespace FaturamentoService.Controllers
{
    [ApiController]
    [Route("api/notas")]
    public class NotasFiscaisController : ControllerBase
    {
        private readonly FaturamentoDbContext _context;
        private readonly EstoqueClientService _estoqueClient;

        public NotasFiscaisController(FaturamentoDbContext context, EstoqueClientService estoqueClient)
        {
            _context = context;
            _estoqueClient = estoqueClient;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotaFiscal>>> GetNotas()
        {
            return await _context.NotasFiscais
                .Include(n => n.Itens)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NotaFiscal>> GetNota(int id)
        {
            var nota = await _context.NotasFiscais
                .Include(n => n.Itens)
                .FirstOrDefaultAsync(n => n.Id == id);

            if (nota == null) return NotFound();
            return nota;
        }

        public class CriarNotaRequest
        {
            public List<ItemRequest> Itens { get; set; } = new();
            public class ItemRequest
            {
                public int ProdutoId { get; set; }
                public int Quantidade { get; set; }
            }
        }

        [HttpPost]
        public async Task<ActionResult<NotaFiscal>> CriarNota(CriarNotaRequest request)
        {
            if (request.Itens == null || !request.Itens.Any())
                return BadRequest(new { erro = "A nota precisa ter ao menos um item." });

            var ultimoNumero = await _context.NotasFiscais.MaxAsync(n => (int?)n.Numero) ?? 0;

            var nota = new NotaFiscal
            {
                Numero = ultimoNumero + 1,
                Status = "Aberta",
                DataCriacao = DateTime.UtcNow,
                Itens = request.Itens.Select(i => new ItemNotaFiscal
                {
                    ProdutoId = i.ProdutoId,
                    Quantidade = i.Quantidade
                }).ToList()
            };

            _context.NotasFiscais.Add(nota);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNota), new { id = nota.Id }, nota);
        }

        [HttpPost("{id}/imprimir")]
        public async Task<IActionResult> ImprimirNota(int id)
        {
            var nota = await _context.NotasFiscais
                .Include(n => n.Itens)
                .FirstOrDefaultAsync(n => n.Id == id);

            if (nota == null)
                return NotFound(new { erro = "Nota fiscal não encontrada." });

            if (nota.Status != "Aberta")
                return BadRequest(new { erro = "Esta nota já foi fechada e não pode ser impressa novamente." });

            foreach (var item in nota.Itens)
            {
                var resultado = await _estoqueClient.BaixarEstoqueAsync(item.ProdutoId, item.Quantidade);

                if (!resultado.Sucesso)
                {
                    return StatusCode(502, new
                    {
                        erro = resultado.MensagemErro,
                        produtoId = item.ProdutoId
                    });
                }
            }

            nota.Status = "Fechada";
            await _context.SaveChangesAsync();

            return Ok(nota);
        }
    }
}