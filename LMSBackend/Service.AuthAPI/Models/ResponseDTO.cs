using Service.LMSApi.Models.Domains;

namespace Service.LMSApi.Models
{
    public class ResponseDTO
    {
        public object Data { get; set; }
        public string message { get; set; }
        public bool isSuccess { get; set; }

    }
}
