namespace KonyhaiAsszisztensBackend.Models
{
    public class ErrorMessage
    {
        public string hu { get; set; }
        public string en { get; set; }
        public ErrorMessage(string Hu, string En)
        {
            hu = Hu;
            en = En;
        }
    }
}
