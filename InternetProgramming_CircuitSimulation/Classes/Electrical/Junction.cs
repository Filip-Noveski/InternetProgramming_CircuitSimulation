using InternetProgramming_CircuitSimulation.Classes.Json;

namespace InternetProgramming_CircuitSimulation.Classes.Electrical;

internal sealed class Junction
{
    public string Id { get; }
    public List<Branch> OutgoingBranches { get; set; }
    public double Potential 
    {
        get
        {
            if (OutgoingBranches.Count == 0)
                return 0;

            if (OutgoingBranches[0].Root is Component component)
                return component.InPotential;

            return 0;
        }
    }

    public Junction()
    {
        Id = Guid.NewGuid().ToString();
        OutgoingBranches = new();
    }

    public void AddOutgoingBranch(Branch branch)
    {
        if (!OutgoingBranches.Contains(branch))
            OutgoingBranches.Add(branch);
    }
    public Branch? GetBranch(string id)
    {
        return OutgoingBranches.Find(x => x.Id == id);
    }

	public List<JsonSimulationData> GetSimulationDataJson()
    {
        List<JsonSimulationData> data = new();
        foreach (var branch in OutgoingBranches)
        {
            data.Add(branch.GetSimulationDataJson());
        }
        return data;
    }

	internal List<JsonSimulationDataTimed> GetSimulationDataTimedJson(VoltageDictionaryKey phase)
    {
        List<JsonSimulationDataTimed> data = new();
        foreach (var branch in OutgoingBranches)
        {
            data.Add(branch.GetSimulationDataTimedJson(phase));
        }
        return data;
    }
	internal void ExpandSimulationDataTimedJson(ref List<JsonSimulationDataTimed> data, VoltageDictionaryKey phase)
    {
        foreach (var branch in OutgoingBranches)
        {
            int index = data.FindIndex(x => x.BranchId == branch.Id)!;
            JsonSimulationDataTimed dataTimed = data[index];
            branch.ExpandSimulationDataTimedJson(ref dataTimed, phase);
            data[index] = dataTimed;
        }
    }


	public static bool operator ==(Junction lhs, Junction rhs) => lhs.Id == rhs.Id;
    public static bool operator !=(Junction lhs, Junction rhs) => lhs.Id != rhs.Id;
}
