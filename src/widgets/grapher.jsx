/** @jsx React.DOM */

var InfoTip          = require("react-components/info-tip.jsx");
var Interactive2     = require("../interactive2.js");
var MultiButtonGroup = require("react-components/multi-button-group.jsx");
var ButtonGroup      = require("react-components/button-group.jsx");
var GraphSettings    = require("../components/graph-settings.jsx");
var Util             = require("../util.js");
var knumber          = KhanUtil.knumber;

/* Graphie and relevant components. */
var Graphie      = require("../components/graphie.jsx");
var MovablePoint = Graphie.MovablePoint;
var Plot         = Graphie.Plot;

/* Mixins. */
var Changeable   = require("../mixins/changeable.jsx");
var JsonifyProps = require("../mixins/jsonify-props.jsx");

/* Utility objects and functions. */
var defaultBoxSize = 400;
var defaultEditorBoxSize = 340;
var defaultBackgroundImage = {
    url: null,
    scale: 1,
    bottom: 0,
    left: 0
};

function typeToButton(type) {
    var capitalized = type.charAt(0).toUpperCase() + type.substring(1);
    return {
        value: type,
        title: capitalized,
        content: <img src={functionForType(type).url} alt={capitalized} />
    };
}

// TODO(charlie): These really need to go into a utility file as they're being
// used by both interactive-graph and now grapher.
function canonicalSineCoefficients(coeffs) {
    // For a curve of the form f(x) = a * Sin(b * x - c) + d,
    // this function ensures that a, b > 0, and c is its
    // smallest possible positive value.
    var amplitude = coeffs[0];
    var angularFrequency = coeffs[1];
    var phase = coeffs[2];
    var verticalOffset = coeffs[3];

    // Guarantee a > 0
    if (amplitude < 0) {
        amplitude *= -1;
        angularFrequency *= -1;
        phase *= -1;
    }

    var period = 2 * Math.PI;
    // Guarantee b > 0
    if (angularFrequency < 0) {
        angularFrequency *= -1;
        phase *= -1;
        phase += period / 2;
    }

    // Guarantee c is smallest possible positive value
    while (phase > 0) {
        phase -= period;
    }
    while (phase < 0) {
        phase += period;
    }

    return [amplitude, angularFrequency, phase, verticalOffset];
}

function canonicalTangentCoefficients(coeffs) {
    // For a curve of the form f(x) = a * Tan(b * x - c) + d,
    // this function ensures that a, b > 0, and c is its
    // smallest possible positive value.
    var amplitude = coeffs[0];
    var angularFrequency = coeffs[1];
    var phase = coeffs[2];
    var verticalOffset = coeffs[3];

    // Guarantee a > 0
    if (amplitude < 0) {
        amplitude *= -1;
        angularFrequency *= -1;
        phase *= -1;
    }

    var period = Math.PI;
    // Guarantee b > 0
    if (angularFrequency < 0) {
        angularFrequency *= -1;
        phase *= -1;
        phase += period / 2;
    }

    // Guarantee c is smallest possible positive value
    while (phase > 0) {
        phase -= period;
    }
    while (phase < 0) {
        phase += period;
    }

    return [amplitude, angularFrequency, phase, verticalOffset];
}

/* Styles */
var typeSelectorStyle = {
    padding: "5px 5px"
};

var graphStyle = {
    padding: "25px 0"
};

/* Graphing interface. */
var FunctionGrapher = React.createClass({
    mixins: [Changeable],

    _coords: function(props) {
        // Coords are usually based on props, but should fall back to the
        // model's default whenever they're not provided (if there's a model)
        props = props || this.props;
        var defaultModelCoords = props.model &&
            Grapher.pointsFromNormalized(props.graph.range, props.graph.step,
                props.graph.snapStep, props.model.defaultCoords);
        return props.coords || defaultModelCoords || null;
    },

    getDefaultProps: function() {
        return {
            graph: {
                range: [[-10, 10], [-10, 10]],
                step: [1, 1]
            },
            coords: null
        };
    },

    render: function() {
        var pointForCoord = (coord, i) => {
            return <MovablePoint
                key={i}
                coord={coord}
                constraints={[
                    Interactive2.MovablePoint.constraints.bound(),
                    Interactive2.MovablePoint.constraints.snap(),
                    (coord) => {
                        // Always enforce that this is a function
                        var isFunction = _.all(this._coords(),
                            (otherCoord, j) => {
                                return i === j  || !otherCoord ||
                                    !knumber.equal(coord[0], otherCoord[0]);
                            });

                        // Evaluate this criteria before per-point constraints
                        if (!isFunction) {
                            return false;
                        }

                        // Specific functions have extra per-point constraints
                        if (this.props.model &&
                                this.props.model.extraConstraints) {
                            var extraConstraint =
                                this.props.model.extraConstraints[i];
                            if (extraConstraint) {
                                return extraConstraint(coord);
                            }
                        }

                        return isFunction;
                    }
                ]}
                onMove={(coord) => {
                    var coords = _.clone(this._coords());
                    coords[i] = coord;
                    this.props.onChange(coords);
                }} />;
        };
        var points = _.map(this._coords(), pointForCoord);

        // Graphie gets all the props except the coords, which are used for
        // graphing the movable points and the underlying plot.
        return Graphie(this.props.graph,
            this.props.model && this.renderPlot(),
            this.props.model && points
        );
    },

    renderPlot: function() {
        var model = this.props.model;
        var xRange = this.props.graph.range[0];
        var style = { stroke: KhanUtil.DYNAMIC };

        var coeffs = model.getCoefficients(this._coords());
        if (!coeffs) {
            return;
        }

        var fn = _.partial(model.getFunctionForCoeffs, coeffs);
        return <Plot fn={fn} range={xRange} style={style} />;
    }
});

var PlotDefaults = {
    areEqual: function(coeffs1, coeffs2) {
        return Util.deepEq(coeffs1, coeffs2);
    }
};

var Linear = _.extend({}, PlotDefaults, {
    url: "https://ka-perseus-graphie.s3.amazonaws.com/67aaf581e6d9ef9038c10558a1f70ac21c11c9f8.png",

    defaultCoords: [[0.25, 0.75], [0.75, 0.75]],

    getCoefficients: function(coords) {
        var p1 = coords[0];
        var p2 = coords[1];

        var denom = p2[0] - p1[0];
        var num = p2[1] - p1[1];

        if (denom === 0) {
            return;
        }

        var m = num / denom;
        var b = p2[1] - m * p2[0];
        return [m, b];
    },

    getFunctionForCoeffs: function(coeffs, x) {
        var m = coeffs[0], b = coeffs[1];
        return m * x + b;
    },

    getEquationString: function(coords) {
        var coeffs = this.getCoefficients(coords);
        var m = coeffs[0], b = coeffs[1];
        return "y = " + m.toFixed(3) + "x + " + b.toFixed(3);
    }
});

var Quadratic = _.extend({}, PlotDefaults, {
    url: "https://ka-perseus-graphie.s3.amazonaws.com/e23d36e6fc29ee37174e92c9daba2a66677128ab.png",

    defaultCoords: [[0.5, 0.5], [0.75, 0.75]],

    getCoefficients: function(coords) {
        var p1 = coords[0];
        var p2 = coords[1];

        // Parabola with vertex (h, k) has form: y = a * (h - k)^2 + k
        var h = p1[0];
        var k = p1[1];

        // Use these to calculate familiar a, b, c
        var a = (p2[1] - k) / ((p2[0] - h) * (p2[0] - h));
        var b = - 2 * h * a;
        var c = a * h * h + k;

        return [a, b, c];
    },

    getFunctionForCoeffs: function(coeffs, x) {
        var a = coeffs[0], b = coeffs[1], c = coeffs[2];
        return (a * x + b) * x + c;
    },

    getEquationString: function(coords) {
        var coeffs = this.getCoefficients(coords);
        var a = coeffs[0], b = coeffs[1], c = coeffs[2];
        return "y = " + a.toFixed(3) + "x^2 + " + b.toFixed(3) +
               "x + " + c.toFixed(3);
    }
});

var Sinusoid = _.extend({}, PlotDefaults, {
    url: "https://ka-perseus-graphie.s3.amazonaws.com/3d68e7718498475f53b206c2ab285626baf8857e.png",

    defaultCoords: [[0.5, 0.5], [0.6, 0.6]],

    getCoefficients: function(coords) {
        var p1 = coords[0];
        var p2 = coords[1];

        var a = (p2[1] - p1[1]);
        var b = Math.PI / (2 * (p2[0] - p1[0]));
        var c = p1[0] * b;
        var d = p1[1];

        return [a, b, c, d];
    },

    getFunctionForCoeffs: function(coeffs, x) {
        var a = coeffs[0], b = coeffs[1], c = coeffs[2], d = coeffs[3];
        return a * Math.sin(b * x - c) + d;
    },

    getEquationString: function(coords) {
        var coeffs = this.getCoefficients(coords);
        var a = coeffs[0], b = coeffs[1], c = coeffs[2], d = coeffs[3];
        return "y = " + a.toFixed(3) + " sin(" + b.toFixed(3) +
               "x - " + c.toFixed(3) + ") + " + d.toFixed(3);
    },

    areEqual: function(coeffs1, coeffs2) {
        return Util.deepEq(canonicalSineCoefficients(coeffs1),
                canonicalSineCoefficients(coeffs2));
    }
});

var Tangent = _.extend({}, PlotDefaults, {
    url: "https://ka-perseus-graphie.s3.amazonaws.com/7db80d23c35214f98659fe1cf0765811c1bbfbba.png",

    defaultCoords: [[0.5, 0.5], [0.75, 0.75]],

    getCoefficients: function(coords) {
        var p1 = coords[0];
        var p2 = coords[1];

        var a = (p2[1] - p1[1]);
        var b = Math.PI / (4 * (p2[0] - p1[0]));
        var c = p1[0] * b;
        var d = p1[1];

        return [a, b, c, d];
    },

    getFunctionForCoeffs: function(coeffs, x) {
        var a = coeffs[0], b = coeffs[1], c = coeffs[2], d = coeffs[3];
        return a * Math.tan(b * x - c) + d;
    },

    getEquationString: function(coords) {
        var coeffs = this.getCoefficients(coords);
        var a = coeffs[0], b = coeffs[1], c = coeffs[2], d = coeffs[3];
        return "y = " + a.toFixed(3) + " sin(" + b.toFixed(3) +
               "x - " + c.toFixed(3) + ") + " + d.toFixed(3);
    },

    areEqual: function(coeffs1, coeffs2) {
        return Util.deepEq(canonicalTangentCoefficients(coeffs1),
                canonicalTangentCoefficients(coeffs2));
    }
});

var Exponential = _.extend({}, PlotDefaults, {
    url: "https://ka-perseus-graphie.s3.amazonaws.com/9cbfad55525e3ce755a31a631b074670a5dad611.png",

    extraConstraints: {
        0: (coord) => coord[1] > 0,
        1: (coord) => coord[1] > 0
    },

    defaultCoords: [[0.5, 0.55], [0.75, 0.75]],

    getCoefficients: function(coords) {
        var p1 = coords[0];
        var p2 = coords[1];

        var b = Math.log(p1[1] / p2[1]) / (p1[0] - p2[0]);
        var a = p1[1] / Math.exp(b * p1[0]);
        return [a, b];
    },

    getFunctionForCoeffs: function(coeffs, x) {
        var a = coeffs[0], b = coeffs[1];
        return a * Math.exp(b * x);
    },

    getEquationString: function(coords) {
        var coeffs = this.getCoefficients(coords);
        var a = coeffs[0], b = coeffs[1];
        return "y = " + a.toFixed(3) + "e^(" + b.toFixed(3) + "x)";
    }
});

var AbsoluteValue = _.extend({}, PlotDefaults, {
    url: "https://ka-perseus-graphie.s3.amazonaws.com/8256a630175a0cb1d11de223d6de0266daf98721.png",

    defaultCoords: [[0.5, 0.5], [0.75, 0.75]],

    getCoefficients: function(coords) {
        var p1 = coords[0];
        var p2 = coords[1];

        var denom = p2[0] - p1[0];
        var num = p2[1] - p1[1];

        if (denom === 0) {
            return;
        }

        var m = Math.abs(num / denom);
        if (p2[1] < p1[1]) {
            m *= -1;
        }
        var horizontalOffset = p1[0];
        var verticalOffset = p1[1];

        return [m, horizontalOffset, verticalOffset];
    },

    getFunctionForCoeffs: function(coeffs, x) {
        var m = coeffs[0],
            horizontalOffset = coeffs[1],
            verticalOffset = coeffs[2];
        return m * Math.abs(x - horizontalOffset) + verticalOffset;
    },

    getEquationString: function(coords) {
        var coeffs = this.getCoefficients(coords);
        var m = coeffs[0],
            horizontalOffset = coeffs[1],
            verticalOffset = coeffs[2];
        return "y = " + m.toFixed(3) + "| x - " +
            horizontalOffset.toFixed(3) + "| + " +
            verticalOffset.toFixed(3);
    }
});

/* Utility functions for dealing with graphing interfaces. */
var functionTypeMapping = {
    "linear": Linear,
    "quadratic": Quadratic,
    "sinusoid": Sinusoid,
    "tangent": Tangent,
    "exponential": Exponential,
    "absolute_value": AbsoluteValue
};

var allTypes = _.keys(functionTypeMapping);

function functionForType(type) {
    return functionTypeMapping[type];
}

/* Widget and editor. */
var Grapher = React.createClass({
    getDefaultProps: function() {
        return {
            plot: {
                type: null,
                coords: null
            },
            graph: {
                box: [defaultEditorBoxSize, defaultEditorBoxSize],
                labels: ["x", "y"],
                range: [[-10, 10], [-10, 10]],
                step: [1, 1],
                backgroundImage: defaultBackgroundImage,
                markings: "graph",
                showProtractor: false,
                showRuler: false,
                rulerLabel: "",
                rulerTicks: 10
            }
        };
    },

    render: function() {
        var type = this.props.plot.type;
        var coords = this.props.plot.coords;

        var typeSelector = <div style={typeSelectorStyle}
                className="above-scratchpad">
            <ButtonGroup
                value={type}
                allowEmpty={true}
                buttons={_.map(this.props.availableTypes, typeToButton)}
                onChange={this.handleActiveTypeChange} />
        </div>;

        var buttonHeight = 60;
        var box = [this.props.graph.box[0],
            this.props.graph.box[1] + buttonHeight];

        // Calculate additional graph properties so that the same values are
        // passed in to both FunctionGrapher and Graphie.
        var options = _.extend({}, this.props.graph,
            this._getGridAndSnapSteps(this.props.graph));

        // The `graph` prop will eventually be passed to the <Graphie>
        // component. In fact, if model is `null`, this is functionalliy
        // identical to a <Graphie>. Otherwise, some points and a plot will be
        // overlayed.
        var grapherProps = {
            graph: {
                box: box,
                range: options.range,
                step: options.step,
                snapStep: options.snapStep,
                options: options,
                setup: this._setupGraphie
            },
            onChange: this.handleCoordsChange,
            model: type && functionForType(type),
            coords: coords
        };

        return <div>
            {FunctionGrapher(grapherProps)}
            {this.props.availableTypes.length > 1 && typeSelector}
        </div>;
    },

    handleCoordsChange: function(newCoords) {
        var plot = _.extend({}, this.props.plot, {
            coords: newCoords
        });
        this.props.onChange({
            plot: plot
        });
    },

    handleActiveTypeChange: function(newType) {
        var plot = _.extend({}, this.props.plot, {
            type: newType,
            coords: null
        });
        this.props.onChange({
            plot: plot
        });
    },

    _getGridAndSnapSteps: function(options) {
        var gridStep = options.gridStep ||
                Util.getGridStep(options.range, options.step, options.box[0]);
        var snapStep = options.snapStep ||
                Util.snapStepFromGridStep(gridStep);
        return {
            gridStep: gridStep,
            snapStep: snapStep
        };
    },

    _getGridConfig: function(options) {
        return _.map(options.step, function(step, i) {
            return Util.gridDimensionConfig(
                    step,
                    options.range[i],
                    options.box[i],
                    options.gridStep[i]);
        });
    },

    _setupGraphie: function(graphie, options) {
        var gridConfig = this._getGridConfig(options);
        if (options.markings === "graph") {
            graphie.graphInit({
                range: options.range,
                scale: _.pluck(gridConfig, "scale"),
                axisArrows: "<->",
                labelFormat: function(s) { return "\\small{" + s + "}"; },
                gridStep: options.gridStep,
                snapStep: options.snapStep,
                tickStep: _.pluck(gridConfig, "tickStep"),
                labelStep: 1,
                unityLabels: _.pluck(gridConfig, "unityLabel")
            });
            graphie.label([0, options.range[1][1]], options.labels[1],
                "above");
            graphie.label([options.range[0][1], 0], options.labels[0],
                "right");
        } else if (options.markings === "grid") {
            graphie.graphInit({
                range: options.range,
                scale: _.pluck(gridConfig, "scale"),
                gridStep: options.gridStep,
                axes: false,
                ticks: false,
                labels: false
            });
        } else if (options.markings === "none") {
            graphie.init({
                range: options.range,
                scale: _.pluck(gridConfig, "scale")
            });
        }
    },

    simpleValidate: function(rubric) {
        return Grapher.validate(this.toJSON(), rubric);
    },

    toJSON: function() {
        return this.props.plot;
    },

    focus: $.noop,

    statics: {
        displayMode: "block"
    }
});

_.extend(Grapher, {
    validate: function(state, rubric) {
        if (state.type !== rubric.correct.type) {
            return {
                type: "points",
                earned: 0,
                total: 1,
                message: null
            };
        }

        // We haven't moved the coords
        if (state.coords == null) {
            return {
                type: "invalid",
                message: null
            };
        }

        // Get new function handler for grading
        var grader = functionForType(state.type);
        var guessCoeffs = grader.getCoefficients(state.coords);
        var correctCoeffs = grader.getCoefficients(rubric.correct.coords);


        if (guessCoeffs == null || correctCoeffs == null) {
            return {
                type: "invalid",
                message: null
            };
        }
        else if (grader.areEqual(guessCoeffs, correctCoeffs)) {
            return {
                type: "points",
                earned: 1,
                total: 1,
                message: null
            };
        } else {
            return {
                type: "points",
                earned: 0,
                total: 1,
                message: null
            };
        }
    },

    getEquationString: function(props) {
        var plot = props.plot;
        if (plot.type && plot.coords) {
            var handler = functionForType(plot.type);
            return handler.getEquationString(plot.coords);
        } else {
            return "";
        }
    },

    pointsFromNormalized: function(range, step, snapStep, coordsList) {
        var numSteps = function(range, step) {
            return Math.floor((range[1] - range[0]) / step);
        };

        return _.map(coordsList, function(coords) {
            var unsnappedPoint = _.map(coords, function(coord, i) {
                var currRange = range[i];
                var currStep = step[i];
                var nSteps = numSteps(currRange, currStep);
                var tick = Math.round(coord * nSteps);
                return currRange[0] + currStep * tick;
            });
            // In some graphing widgets, e.g. interactive-graph, you can rely
            // on the Graphie to handle snapping. Here, we need the points
            // returned to already be snapped so that the plot that goes
            // through them is correct.
            return KhanUtil.kpoint.roundTo(unsnappedPoint, snapStep);
        });
    }
});

var GrapherEditor = React.createClass({
    mixins: [Changeable],

    getDefaultProps: function() {
        return {
            correct: {
                type: "linear",
                coords: null
            },
            graph: {
                box: [defaultEditorBoxSize, defaultEditorBoxSize],
                labels: ["x", "y"],
                range: [[-10, 10], [-10, 10]],
                step: [1, 1],
                backgroundImage: defaultBackgroundImage,
                markings: "graph",
                showProtractor: false,
                showRuler: false,
                rulerLabel: "",
                rulerTicks: 10
            },
            availableTypes: ["linear"],
            valid: true
        };
    },

    render: function() {
        var graph;
        var equationString;

        if (this.props.valid === true) {
            var graphProps = {
                graph: this.props.graph,
                plot: this.props.correct,
                availableTypes: this.props.availableTypes,
                onChange: (newProps, cb) => {
                    var correct = this.props.correct;
                    if (correct.type === newProps.plot.type) {
                        correct = _.extend({}, correct, newProps.plot);
                    } else {
                        // Clear options from previous graph
                        correct = newProps.plot;
                    }
                    this.props.onChange({correct: correct}, cb);
                }
            };

            graph = Grapher(graphProps);
            equationString = Grapher.getEquationString(graphProps);
        } else {
            graph = <div>{this.props.valid}</div>;
        }

        return <div>
            <div>Correct answer{' '}
                <InfoTip>
                    <p>Graph the correct answer in the graph below and ensure
                    the equation or point coordinates displayed represent the
                    correct answer.</p>
                </InfoTip>
                {' '}: {equationString}</div>

            <GraphSettings
                box={this.props.graph.box}
                range={this.props.graph.range}
                labels={this.props.graph.labels}
                step={this.props.graph.step}
                gridStep={this.props.graph.gridStep}
                snapStep={this.props.graph.snapStep}
                valid={this.props.valid}
                backgroundImage={this.props.graph.backgroundImage}
                markings={this.props.graph.markings}
                showProtractor={this.props.graph.showProtractor}
                showRuler={this.props.graph.showRuler}
                rulerLabel={this.props.graph.rulerLabel}
                rulerTicks={this.props.graph.rulerTicks}
                onChange={this.change("graph")} />
            <div className="perseus-widget-row">
                <label>Available functions:{' '} </label>
                <MultiButtonGroup
                    allowEmpty={false}
                    values={this.props.availableTypes}
                    buttons={_.map(allTypes, typeToButton)}
                    onChange={this.handleAvailableTypesChange} />
            </div>
            {graph}
        </div>;
    },

    handleAvailableTypesChange: function(newAvailableTypes) {
        var correct = this.props.correct;

        // If the currently 'correct' type is removed from the list of types,
        // we need to change it to avoid impossible questions.
        if (!_.contains(newAvailableTypes, this.props.correct.type)) {
            var correct = {
                type: _.first(newAvailableTypes),
                coords: null
            };
        }
        this.props.onChange({
            availableTypes: newAvailableTypes,
            correct: correct
        });
    },

    toJSON: function() {
        var json = _.pick(this.props, "graph", "correct", "availableTypes");
        return json;
    }
});

var propTransform = (editorProps) => {
    var widgetProps = _.pick(editorProps, "graph", "availableTypes");

    // If there's only one type, the graph type is deterministic
    if (widgetProps.availableTypes.length === 1) {
        var plot = {
            type: _.first(widgetProps.availableTypes),
            coords: null
        };
        _.extend(widgetProps, { plot: plot });
    }

    return widgetProps;
};

module.exports = {
    name: "grapher",
    displayName: "Grapher",
    widget: Grapher,
    editor: GrapherEditor,
    transform: propTransform
};
