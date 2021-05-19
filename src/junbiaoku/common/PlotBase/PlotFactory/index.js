import PlotTypes from "../PlotTypes";

import Polygon from "../PolygonPlot/Polygon";
import ClosedCurve from "../PolygonPlot/ClosedCurve";
import Circle from "../PolygonPlot/Circle";
import Ellipse from "../PolygonPlot/Ellipse";
import Sector from "../PolygonPlot/Sector";
import Rectangle from "../PolygonPlot/Rectangle";
import FineArrow from "../PolygonPlot/FineArrow";
import AssaultDirection from "../PolygonPlot/AssaultDirection";
import AttackArrow from "../PolygonPlot/AttackArrow";
import TailedAttackArrow from "../PolygonPlot/TailedAttackArrow";
import DoubleArrow from "../PolygonPlot/DoubleArrow";
import GatheringPlace from "../PolygonPlot/GatheringPlace";
import SquadCombat from "../PolygonPlot/SquadCombat";
import TailedSquadCombat from "../PolygonPlot/TailedSquadCombat";

import Marker from "../MarkerPlot/Marker";

import Polyline from "../LinePolt/Polyline";

let PlotFactory = {
  createPlot(viewer, plotType, baseInfo, properties) {
    switch (plotType) {
      case PlotTypes.POLYGON:
        return new Polygon(viewer, baseInfo, properties);
      case PlotTypes.DOUBLE_ARROW:
        return new DoubleArrow(viewer, baseInfo, properties);
      case PlotTypes.ATTACK_ARROW:
        return new AttackArrow(viewer, baseInfo, properties);
      case PlotTypes.ELLIPSE:
        return new Ellipse(viewer, baseInfo, properties);
      case PlotTypes.CIRCLE:
        return new Circle(viewer, baseInfo, properties);
      case PlotTypes.FINE_ARROW:
        return new FineArrow(viewer, baseInfo, properties);
      case PlotTypes.TAILED_ATTACK_ARROW:
        return new TailedAttackArrow(viewer, baseInfo, properties);
      case PlotTypes.ASSAULT_DIRECTION:
        return new AssaultDirection(viewer, baseInfo, properties);
      case PlotTypes.GATHERING_PLACE:
        return new GatheringPlace(viewer, baseInfo, properties);
      case PlotTypes.CLOSED_CURVE:
        return new ClosedCurve(viewer, baseInfo, properties);
      case PlotTypes.SECTOR:
        return new Sector(viewer, baseInfo, properties);
      case PlotTypes.RECTANGLE:
        return new Rectangle(viewer, baseInfo, properties);
      case PlotTypes.SQUAD_COMBAT:
        return new SquadCombat(viewer, baseInfo, properties);
      case PlotTypes.TAILED_SQUAD_COMBAT:
        return new TailedSquadCombat(viewer, baseInfo, properties);

      case PlotTypes.MARKER:
        return new Marker(viewer, baseInfo, properties);

      case PlotTypes.POLYLINE:
        return new Polyline(viewer, baseInfo, properties);
    }
  },
};

export default PlotFactory;
