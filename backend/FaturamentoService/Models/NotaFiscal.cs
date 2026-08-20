namespace FaturamentoService.Models
{
    public class NotaFiscal
    {
        public int Id { get; set; }
        public int Numero { get; set; }
        public string Status { get; set; } = "Aberta"; // Aberta ou Fechada
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

        public List<ItemNotaFiscal> Itens { get; set; } = new();
    }
}