namespace KonyhaiAsszisztensBackend.Models
{
    public class ErrorMessage
    {
        public string Field { get; set; } 
        public string MessageHu { get; set; } 
        public string MessageEn { get; set; } 

        public ErrorMessage(string field, string messageHu, string messageEn)
        {
            Field = field;
            MessageHu = messageHu;
            MessageEn = messageEn;
        }
    }
}
