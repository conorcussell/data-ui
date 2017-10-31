import React from 'react';

import {
  XYChart,
  CrossHair,

  XAxis,
  YAxis,

  AreaSeries,
  BarSeries,
  CirclePackSeries,
  GroupedBarSeries,
  IntervalSeries,
  LineSeries,
  PointSeries,
  StackedBarSeries,

  HorizontalReferenceLine,
  PatternLines,
  LinearGradient,
  theme,
} from '@data-ui/xy-chart';

import readme from '../../node_modules/@data-ui/xy-chart/README.md';

import CirclePackWithCallback from './CirclePackWithCallback';
import RectPointComponent from './RectPointComponent';
import ResponsiveXYChart, { dateFormatter } from './ResponsiveXYChart';
import ScatterWithHistogram from './ScatterWithHistograms';

import {
  circlePackData,
  timeSeriesData,
  categoricalData,
  groupKeys,
  stackedData,
  groupedData,
  pointData,
  intervalLineData,
  intervalData,
  temperatureBands,
  priceBandData,
} from './data';

import WithToggle from '../shared/WithToggle';

const { colors } = theme;
PatternLines.displayName = 'PatternLines';
LinearGradient.displayName = 'LinearGradient';

export default {
  usage: readme,
  examples: [
    {
      description: 'BarSeries -- no axes',
      components: [XYChart, BarSeries, LinearGradient, PatternLines],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
        >
          <LinearGradient
            id="gradient"
            from={colors.default}
            to={colors.dark}
          />
          <PatternLines
            id="lines"
            height={8}
            width={8}
            stroke={colors.categories[2]}
            strokeWidth={1}
            orientation={['horizontal', 'vertical']}
          />
          <BarSeries
            data={timeSeriesData.map((d, i) => ({
              ...d,
              fill: `url(#${i === 2 ? 'lines' : 'gradient'})`,
            }))}
            label="Apple Stock"
            fill="url(#aqua_lightaqua_gradient)"
          />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'LineSeries',
      components: [LineSeries, CrossHair],
      example: () => {
        const data2 = timeSeriesData.map(d => ({
          ...d,
          y: Math.random() > 0.5 ? d.y * 2 : d.y / 2,
        }));
        return (
          <WithToggle id="lineseries_toggle" label="Show voronoi" initialChecked>
            {showVoronoi => (
              <ResponsiveXYChart
                ariaLabel="Required label"
                xScale={{ type: 'time' }}
                yScale={{ type: 'linear' }}
                useVoronoi
                showVoronoi={showVoronoi}
              >
                <YAxis label="Price ($)" numTicks={4} />
                <LineSeries
                  data={timeSeriesData}
                  label="Apple Stock"
                  showPoints
                />
                <LineSeries
                  data={data2}
                  label="Apple Stock 2"
                  stroke={colors.categories[2]}
                  strokeDasharray="3 3"
                  strokeLinecap="butt"
                />
                <CrossHair />
                <XAxis label="Time" numTicks={5} />
              </ResponsiveXYChart>
            )}
          </WithToggle>
        );
      },
    },
    {
      description: 'AreaSeries -- closed',
      components: [AreaSeries],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
        >
          <LinearGradient
            id="area_gradient"
            from={colors.categories[2]}
            to="#fff"
          />
          <PatternLines
            id="area_pattern"
            height={12}
            width={12}
            stroke={colors.categories[2]}
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <AreaSeries
            data={timeSeriesData}
            label="Apple Stock"
            fill="url(#area_gradient)"
            strokeWidth={null}
          />
          <AreaSeries
            data={timeSeriesData}
            label="Apple Stock 2"
            fill="url(#area_pattern)"
            stroke={colors.categories[2]}
          />
          <CrossHair
            showHorizontalLine={false}
            fullHeight
            stroke={colors.darkGray}
            circleFill="white"
            circleStroke={colors.darkGray}
          />
          <XAxis label="Time" numTicks={5} />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'AreaSeries -- band',
      components: [XYChart, AreaSeries, LineSeries],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
        >
          {temperatureBands.map((data, i) => ([
            <PatternLines
              id={`band-${i}`}
              height={5}
              width={5}
              stroke={colors.categories[i + 1]}
              strokeWidth={1}
              orientation={['diagonal']}
            />,
            <AreaSeries
              key={`band-${data[0].key}`}
              label="Temperature range"
              data={data}
              strokeWidth={0.5}
              stroke={colors.categories[i + 1]}
              fill={`url(#band-${i})`}
            />,
            <LineSeries
              key={`line-${data[0].key}`}
              data={data}
              stroke={colors.categories[i + 1]}
              label="Temperature avg"
            />,
          ]))}
          <YAxis label="Temperature (°F)" numTicks={4} />
          <CrossHair
            showHorizontalLine={false}
            fullHeight
            stroke={colors.gray}
            circleStroke={colors.gray}
          />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'AreaSeries -- confidence intervals',
      components: [XYChart, AreaSeries, LineSeries, PointSeries],
      example: (reference = 150) => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
          useVoronoi
        >
          <XAxis numTicks={5} />
          <YAxis label="Price ($)" />
          <LinearGradient
            id="confidence-interval-fill"
            from={colors.categories[3]}
            to={colors.categories[4]}
          />
          <HorizontalReferenceLine
            reference={reference}
            label={`Min $${reference}`}
          />
          <AreaSeries
            label="band"
            data={priceBandData.band}
            fill="url(#confidence-interval-fill)"
            strokeWidth={0}
          />
          <LineSeries
            label="line"
            data={priceBandData.points.map(d => (d.y >= reference ? d : { ...d, y: reference }))}
            stroke={colors.categories[3]}
          />
          <PointSeries
            label="line"
            data={priceBandData.points.filter(d => d.y < reference)}
            fill="#fff"
            fillOpacity={1}
            stroke={colors.categories[3]}
          />

          <CrossHair
            showHorizontalLine={false}
            fullHeight
            stroke={colors.categories[3]}
            circleStroke={colors.categories[3]}
            circleFill="transparent"
          />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'PointSeries with Histogram',
      components: [PointSeries],
      example: () => (
        <ScatterWithHistogram />
      ),
    },
    {
      description: 'PointSeries',
      components: [PointSeries],
      example: () => (
        <WithToggle id="pointseries_toggle" label="Show voronoi" initialChecked>
          {showVoronoi => (
            <ResponsiveXYChart
              ariaLabel="Required label"
              xScale={{ type: 'linear', nice: true }}
              yScale={{ type: 'linear', nice: true }}
              showXGrid={false}
              showYGrid={false}
              useVoronoi
              showVoronoi={showVoronoi}
            >
              <YAxis label="Y" numTicks={4} />
              <XAxis label="X" numTicks={4} />
              <PointSeries
                data={pointData}
                label="Random"
                size={d => d.size}
              />
              <CrossHair fullWidth fullHeight showCircle={false} />
            </ResponsiveXYChart>
          )}
        </WithToggle>
      ),
    },
    {
      description: 'PointSeries With Customized Renderer',
      components: [PointSeries],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'linear', nice: true }}
          yScale={{ type: 'linear', nice: true }}
        >
          <YAxis label="Y" numTicks={4} />
          <XAxis label="X" numTicks={4} />
          <PointSeries
            data={pointData}
            label="Random"
            size={d => d.size}
            pointComponent={RectPointComponent}
          />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'StackedBarSeries',
      components: [StackedBarSeries],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'band', paddingInner: 0.05 }}
          yScale={{ type: 'linear' }}
        >
          <YAxis label="Temperature (°F)" numTicks={4} />
          <StackedBarSeries
            data={stackedData}
            label="City Temperature"
            stackKeys={groupKeys}
          />
          <XAxis tickFormat={dateFormatter} />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'GroupedBarSeries',
      components: [GroupedBarSeries],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'band', paddingInner: 0.15 }}
          yScale={{ type: 'linear' }}
          showYGrid={false}
        >
          <YAxis label="Temperature (°F)" numTicks={4} />
          <GroupedBarSeries
            data={groupedData}
            label="City Temperature"
            groupKeys={groupKeys}
          />
          <XAxis tickFormat={dateFormatter} />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'Categorical BarSeries',
      components: [XYChart, BarSeries, CrossHair],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'band' }}
          yScale={{ type: 'linear' }}
        >
          <LinearGradient
            id="aqua_lightaqua_gradient"
            from={colors.default}
            to={colors.dark}
          />
          <BarSeries
            data={categoricalData}
            label="Apple Stock"
            fill="url(#aqua_lightaqua_gradient)"
          />
          <XAxis numTicks={categoricalData.length} />
          <CrossHair
            stroke={colors.dark}
            circleFill={colors.dark}
            showVerticalLine={false}
            fullWidth
          />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'IntervalSeries',
      components: [IntervalSeries, LineSeries, CrossHair],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear', domain: [40, 80] }}
        >
          <YAxis label="Temperature (°F)" numTicks={4} />
          <PatternLines
            id="interval_pattern"
            height={8}
            width={8}
            stroke={colors.dark}
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <LineSeries
            data={intervalLineData}
            label="Line interval"
            showPoints
          />
          <IntervalSeries
            data={intervalData}
            label="Temperature interval"
            fill="url(#interval_pattern)"
          />
          <XAxis numTicks={0} />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'CirclePackSeries',
      components: [CirclePackSeries],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
        >
          <CirclePackSeries
            data={circlePackData}
            label="Circle time pack"
            size={d => d.r}
          />
          <HorizontalReferenceLine
            reference={0}
          />
          <CrossHair
            showHorizontalLine={false}
            fullHeight
            stroke={colors.darkGray}
            circleFill="white"
            circleStroke={colors.darkGray}
          />
          <XAxis label="Time" numTicks={5} />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'CirclePackSeries with custom renderer and height callback',
      components: [CirclePackSeries],
      example: () => <CirclePackWithCallback />,
    },
    {
      description: 'Mixed series',
      components: [BarSeries, LineSeries, XAxis, YAxis, CrossHair],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
        >
          <YAxis label="Price ($)" numTicks={4} />
          <LinearGradient
            id="aqua_lightaqua_gradient"
            to="#faa2c1"
            from="#e64980"
          />
          <BarSeries
            data={timeSeriesData}
            label="Apple Stock"
            fill="url(#aqua_lightaqua_gradient)"
          />
          <LineSeries
            data={timeSeriesData}
            label="Apple Stock"
            stroke={colors.text}
          />
          <XAxis label="Time" numTicks={5} />
          <CrossHair />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'XAxis, YAxis -- orientation',
      components: [XAxis, YAxis],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
        >
          <YAxis label="Price ($)" numTicks={4} orientation="left" />
          <LinearGradient
            id="aqua_lightaqua_gradient"
            from={colors.default}
            to={colors.dark}
          />
          <BarSeries
            data={timeSeriesData}
            label="Apple Stock"
            fill="url(#aqua_lightaqua_gradient)"
          />
          <XAxis label="Time" numTicks={5} orientation="top" />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'Non-zero y-axis',
      components: [YAxis],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear', includeZero: false }}
        >
          <YAxis label="$$$" numTicks={4} />
          <LinearGradient
            id="aqua_lightaqua_gradient"
            from={colors.default}
            to={colors.dark}
          />
          <BarSeries
            data={timeSeriesData}
            label="Apple Stock"
            fill="url(#aqua_lightaqua_gradient)"
          />
          <XAxis numTicks={0} />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'No theme',
      components: [XYChart, CrossHair],
      example: () => (
        <ResponsiveXYChart
          theme={{}}
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
        >
          <YAxis label="Price ($)" numTicks={4} />
          <BarSeries
            data={timeSeriesData.filter((d, i) => i % 2 === 0)}
            label="Apple Stock"
            fill="#484848"
          />
          <BarSeries
            data={timeSeriesData.filter((d, i) => i % 2 !== 0 && i !== 5)}
            label="Apple Stock ii"
            fill="#767676"
          />
          <XAxis label="Time" numTicks={5} />
          <CrossHair />
        </ResponsiveXYChart>
      ),
    },
  ],
};
