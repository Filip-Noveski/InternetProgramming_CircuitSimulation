using Microsoft.AspNetCore.Mvc;
using InternetProgramming_CircuitSimulation.Classes.Electrical;

namespace InternetProgramming_CircuitSimulation.ViewComponents;

public class ElectricItemViewComponent : ViewComponent
{
    public ElectricItemViewComponent()
    {

    }

    public IViewComponentResult Invoke(string id, string component, string rotation, string left, string top, string value)
    {
        component = component.ToUpper();
        ViewBag.PathToSymbol = component switch
        {
            "RESISTOR" => Resistor.PathToSymbol,
            "VOLTAGESOURCEDC" => VoltageSourceDC.PathToSymbol,
            "VOLTAGESOURCESIN" => VoltageSourceSin.PathToSymbolRotationBased(double.Parse(rotation)),
            "CONDUCTOR" => Conductor.PathToSymbol,
            _ => "/images/components/error.svg"
        };
        ViewBag.Rotation = rotation;
        ViewBag.Left = left;
        ViewBag.Top = top;
        ViewBag.Value = Component.FormatValue(component, value);
        ViewBag.Id = id;
        return View();
    }
}
