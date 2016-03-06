const React = require("react");
const _ = require("underscore");

const Changeable = require("../mixins/changeable.jsx");
const EditorJsonify = require("../mixins/editor-jsonify.jsx");
const NumberInput = require("../components/number-input.jsx");
const TextInput = require("../components/text-input.jsx");

const draw = require("./molecule/molecule-drawing.jsx");
const {layout} = require("./molecule/molecule-layout.jsx");
const SmilesParser = require("./molecule/smiles-parser.jsx");

const parse = SmilesParser.parse;
const ParseError = SmilesParser.ParseError;

const borderSize = 30;

const Molecule = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        rotationAngle: React.PropTypes.number,
        smiles: React.PropTypes.string,
    },

    getInitialState: function() {
        return { parsedSmiles: null, error: null };
    },

    componentWillMount: function() {
        this.stateFromSmiles(this.props.smiles);
    },

    componentDidMount: function() {
        this.canvasRender();
    },

    componentWillReceiveProps: function(nextProps) {
        this.stateFromSmiles(nextProps.smiles);
    },

    componentDidUpdate: function() {
        this.canvasRender();
    },

    stateFromSmiles: function(smiles) {
        try {
            this.setState({
                parsedSmiles: parse(smiles),
                error: null,
            });
        } catch (e) {
            if (e instanceof ParseError) {
                this.setState({error: e.message});
            } else {
                throw e;
            }
        }
    },

    setCanvasBounds: function(canvas, items) {
        const xmax = _.max(items, function(item) {
            if (!item.pos) {
                return -Infinity;
            }
            return item.pos[0];
        }).pos[0];
        const ymax = _.max(items, function(item) {
            if (!item.pos) {
                return -Infinity;
            }
            return item.pos[1];
        }).pos[1];
        const xmin = _.min(items, function(item) {
            if (!item.pos) {
                return Infinity;
            }
            return item.pos[0];
        }).pos[0];
        const ymin = _.min(items, function(item) {
            if (!item.pos) {
                return Infinity;
            }
            return item.pos[1];
        }).pos[1];
        const width = xmax - xmin + 2 * borderSize;
        const height = ymax - ymin + 2 * borderSize;
        canvas.width = width;
        canvas.height = height;
        return [borderSize - xmin, borderSize - ymin];
    },

    canvasRender: function() {
        // Since canvas drawing happens only through an imperative API, we sync
        // up the component with the canvas here, which happens when the
        // component mounts or updates.
        if (!!this.state.error || !this.state.parsedSmiles) { return; }
        const items = layout(this.state.parsedSmiles, this.props.rotationAngle);
        const canvas = this.refs.canvas;
        const translation = this.setCanvasBounds(canvas, items);
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(translation[0], translation[1]);
        draw(ctx, items);
        ctx.restore();
    },
    render: function() {
        // TODO(colin): escape the punctuation in the SMILES alt text for
        // screen readers?
        let content = <canvas
            className="molecule-canvas"
            id={this.props.id + "-molecule"}
            ref="canvas"
        >
            A molecular structure drawing.  SMILES notation:
            {this.props.smiles}.
        </canvas>;
        if (this.state.error) {
            content = <div className="error">{this.state.error}</div>;
        }
        return <div className="molecule-canvas">{content}</div>;
    },
});


const MoleculeWidget = React.createClass({
    propTypes: {
        rotationAngle: React.PropTypes.number,
        smiles: React.PropTypes.string,
        widgetId: React.PropTypes.string,
    },

    getDefaultProps: function() {
        return {rotationAngle: 0};
    },

    simpleValidate: function() {
        return {type: "points", earned: 0, total: 0, message: null};
    },

    getUserInput: function() {
        return [];
    },

    validate: function(state, rubric) {
        // TODO(colin): this is here as part of the interface for a component.
        // Figure out if there is something more appropriate that this should
        // return.
        return {
            type: "points",
            earned: 0,
            total: 0,
            message: null,
        };
    },

    render: function() {
        return <Molecule
            id={this.props.widgetId}
            smiles={this.props.smiles}
            rotationAngle={this.props.rotationAngle}
        />;
    },
});

const MoleculeWidgetEditor = React.createClass({
    propTypes: {
        rotationAngle: React.PropTypes.number,
        smiles: React.PropTypes.string,
    },

    mixins: [Changeable, EditorJsonify],

    updateMolecule: function(newValue) {
        this.change({smiles: newValue});
    },

    updateRotation: function(newValue) {
        this.change({rotationAngle: newValue});
    },

    render: function() {
        return <div>
            <div>
                {/* TODO(colin): instead of nbsp hacks, use styles to get the
                    spacing right. */}
                <label>SMILES:&nbsp;
                    <TextInput
                        onChange={this.updateMolecule}
                        value={this.props.smiles}
                    />
                </label>
            </div>
            <div>
                <label>Rotation (deg):&nbsp;
                    <NumberInput
                        onChange={this.updateRotation}
                        value={this.props.rotationAngle}
                    />
                </label>
            </div>
        </div>;
    },

});

module.exports = {
    name: "molecule-renderer",
    displayName: "Molecule renderer",
    hidden: false,
    widget: MoleculeWidget,
    editor: MoleculeWidgetEditor,
    molecule: Molecule,
};
