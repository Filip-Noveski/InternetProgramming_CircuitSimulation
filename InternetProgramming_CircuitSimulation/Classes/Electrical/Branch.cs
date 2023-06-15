using System.Reflection;
using InternetProgramming_CircuitSimulation.Classes.Json;

namespace InternetProgramming_CircuitSimulation.Classes.Electrical;

internal sealed class Branch
{
    private short _direction = 1;
    public Component? Root { get; private set; }
    public Junction TerminalJunction { get; private set; }
    public double Current { get; private set; }
    public string Id { get; }

    public Branch(Component root, Junction terminalJunction)
    {
        Root = root;
        Root.Parent = this;
        TerminalJunction = terminalJunction;
        Id = Guid.NewGuid().ToString();
    }
    public Branch(Component root)
    {
        Root = root;
        Root.Parent = this;
        TerminalJunction = new();
        Id = Guid.NewGuid().ToString();
    }
    public Branch(Junction terminalJunction)
    {
        Root = null;
        TerminalJunction = terminalJunction;
        Id = Guid.NewGuid().ToString();
    }
    public Branch()
    {
        Root = null;
        TerminalJunction = new();
        Id = Guid.NewGuid().ToString();
    }

    public void AddComponentToEnd(Component component)
    {
        component.Parent = this;
        if (Root is null)
        {
            Root = component;
            return;
        }

        Root.AddComponentToEnd(component);
    }
    public void SetCurrent(double current)
    {
        if (double.IsNaN(current))
            current = 0;
		else if (double.IsInfinity(current))
            current = double.MaxValue;
        else if (double.IsNegativeInfinity(current))
            current = double.MinValue;

        current *= _direction;
        Current = current;

        Component? selected = Root;
        while (selected is not null)
        {
            selected.SetSuccessorPotential(ref current, TerminalJunction);
            selected = selected.Next;
        }
    }

    public string Report()
    {
        string ret = $"{{ Branch {Id}: I = {Current:####0.00000}A; Terminal Junction Id = {TerminalJunction.Id} }}\n";
        if (Root is null)
        {
            ret += "This branch does not contain any components.";
            return ret;
        }

        ret += "Components:\n";
        Component? component = Root;
        while (component is not null)
        {
            ret += component.Description + "\n";
            component = component.Next;
        }

        return ret;
    }
	public JsonSimulationData GetSimulationDataJson()
    {
        JsonSimulationData data = new()
        {
            BranchId = Id,
            Current = Current,
            Components = new()
        };

        Component? selected = Root;
        while (selected is not null)
        {
            data.Components.Add(new()
            {
                InPotential = selected.InPotential
            });

            selected = selected.Next;
        }

        return data;
    }
	internal JsonSimulationDataTimed GetSimulationDataTimedJson(VoltageDictionaryKey phase)
    {
        string val = (string)phase.Type.GetMethod("GetPhaseFunction",
            BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Instance)!
            .Invoke(null, new object?[]
        {
            phase,
            Current
        })!;
        JsonSimulationDataTimed data = new()
        {
            BranchId = Id,
            Current = $"t =>{val}",
            Components = new()
        };

        Component? selected = Root;
        while (selected is not null)
        {
            val = (string)phase.Type.GetMethod("GetPhaseFunction",
                BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Instance)!
                .Invoke(null, new object?[]
            {
                phase,
                selected.InPotential
            })!;
            data.Components.Add(new()
            {
                InPotential = $"t => {val}"
            });

            selected = selected.Next;
        }

        return data;
    }
	internal void ExpandSimulationDataTimedJson(ref JsonSimulationDataTimed data, VoltageDictionaryKey phase)
    {
        string val = (string)phase.Type.GetMethod("GetPhaseFunction",
            BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Instance)!
            .Invoke(null, new object?[]
        {
            phase,
            Current
        })!;
        data.Current += val;

        Component? selected = Root;
        int i = 0;
        while (selected is not null)
        {
            val = (string)phase.Type.GetMethod("GetPhaseFunction",
            BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Instance)!
            .Invoke(null, new object?[]
            {
                phase,
                selected.InPotential
            })!;
            data.Components![i++].InPotential += val;

            selected = selected.Next;
        }
    }
    internal void Invert(ref Junction sourceJunction)
    {
        _direction *= -1;
        TerminalJunction.OutgoingBranches.Add(this);
        this.TerminalJunction = sourceJunction;
        sourceJunction.OutgoingBranches.Remove(this);

        if (Root is null)
            return;

        Component? selected = Root;
        Component? newRoot = null;
        while (selected is not null)
        {
            Component? next = newRoot;
            newRoot = selected.GetNewInverted();
            if (next is not null)
                newRoot.AddComponentToEnd(next);
            selected = selected.Next;
        }
    }

	public static bool operator ==(Branch lhs, Branch rhs) => lhs.Id == rhs.Id;
    public static bool operator !=(Branch lhs, Branch rhs) => lhs.Id != rhs.Id;
}
