using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EstoqueService.Data;
using EstoqueService.Models;

namespace EstoqueService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutosController : ControllerBase
    {
        private readonly EstoqueDbContext _context;

        public ProdutosController(EstoqueDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Produto>>> GetProdutos()
        {
            return await _context.Produtos.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Produto>> GetProduto(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto == null) return NotFound();
            return produto;
        }

        [HttpPost]
        public async Task<ActionResult<Produto>> CreateProduto(Produto produto)
        {
            _context.Produtos.Add(produto);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProduto), new { id = produto.Id }, produto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduto(int id, Produto produto)
        {
            if (id != produto.Id) return BadRequest();
            _context.Entry(produto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Produtos.AnyAsync(p => p.Id == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduto(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto == null) return NotFound();

            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("baixar-estoque")]
        public async Task<IActionResult> BaixarEstoque(BaixaEstoqueRequest request)
        {
            var produto = await _context.Produtos.FindAsync(request.ProdutoId);
            if (produto == null)
                return NotFound(new { erro = "Produto não encontrado." });

            if (produto.Saldo < request.Quantidade)
                return BadRequest(new { erro = "Estoque insuficiente." });

            produto.Saldo -= request.Quantidade;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict(new { erro = "Conflito de concorrência. Tente novamente." });
            }

            return Ok(produto);
        }
    }
}