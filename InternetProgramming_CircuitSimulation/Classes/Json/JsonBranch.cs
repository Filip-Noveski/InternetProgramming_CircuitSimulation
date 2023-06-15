namespace InternetProgramming_CircuitSimulation.Classes.Json;

public class JsonBranch
{
	public string? Id { get; set; }
	public string? SourceJunction { get; set; }
	public string? TerminalJunction { get; set; }
	public bool? IsClosed { get; set; }
	public List<JsonComponent>? Components { get; set; }
}
