using Microsoft.AspNetCore.Mvc;

namespace InternetProgramming_CircuitSimulation.Controllers;

public class ViewComponentController : Controller
{
    private readonly ILogger _logger;

    public ViewComponentController(ILogger<ViewComponentController> logger)
    {
        _logger = logger;
    }

    public IActionResult ElectricItem(string id, string component, string rotation, string left, string top, string value)
    {
		return ViewComponent("ElectricItem", new
        {
            id,
			component,
			rotation,
			left,
			top,
            value
        });
	}

    public IActionResult ManagementMenu()
    {
        return PartialView("_ManagementMenu");
    }

    public IActionResult MeasuringDevices()
    {
        return PartialView("_MeasuringDevices");
    }
}