var INITIAL_SIZE = 250,
    INITIAL_WIND = [10.0, 10.0],
    INITIAL_CHOPPINESS = 1.5;

var CLEAR_COLOR = [1.0, 1.0, 1.0, 0.0],
    GEOMETRY_ORIGIN = [-100.0, -100.0],
    SUN_DIRECTION = [-1.0, 1.0, 1.0],
    OCEAN_COLOR = [0.004, 0.016, 0.047],
    SKY_COLOR = [3.2, 9.6, 12.8],
    EXPOSURE = 0.15,
    GEOMETRY_RESOLUTION = 256,
    GEOMETRY_SIZE = 200,
    RESOLUTION = 512;

var SIZE_OF_FLOAT = 4;

var INITIAL_SPECTRUM_UNIT = 0,
    SPECTRUM_UNIT = 1,
    DISPLACEMENT_MAP_UNIT = 2,
    NORMAL_MAP_UNIT = 3,
    PING_PHASE_UNIT = 4,
    PONG_PHASE_UNIT = 5,
    PING_TRANSFORM_UNIT = 6,
    PONG_TRANSFORM_UNIT = 7;

var UI_COLOR = 'rgb(52, 137, 189)';

var PROFILE_AMPLITUDE = 50,
    PROFILE_OMEGA = 0.05,
    PROFILE_PHI = -2.5,
    PROFILE_STEP = 5,
    PROFILE_OFFSET = 52,
    PROFILE_COLOR = 'rgb(52, 137, 189)',
    PROFILE_LINE_WIDTH = 3,
    CHOPPINESS_SCALE = 0.15;

var ARROW_ORIGIN = [-1250, 0, 500],
    ARROW_SHAFT_WIDTH = 80,
    ARROW_HEAD_WIDTH = 160,
    ARROW_HEAD_HEIGHT = 60,
    ARROW_OFFSET = 40,
    WIND_SCALE = 8.0,
    MIN_WIND_SPEED = 5.0,
    MAX_WIND_SPEED = 25.0;

var HANDLE_COLOR = '#666666',
    SLIDER_LEFT_COLOR = UI_COLOR,
    SLIDER_RIGHT_COLOR = '#999999';

var FOV = (60 / 180) * Math.PI,
    NEAR = 1,
    FAR = 10000,
    MIN_ASPECT = 16 / 9;
    
var WIND_SPEED_DECIMAL_PLACES = 1,
    SIZE_DECIMAL_PLACES = 0,
    CHOPPINESS_DECIMAL_PLACES = 1;

var SENSITIVITY = 1.0;

var WIND_SPEED_X = -1350;
var MIN_WIND_SPEED_Z = 600,
    WIND_SPEED_OFFSET = 30;

var OVERLAY_DIV_ID = 'overlay',
    PROFILE_CANVAS_ID = 'profile',
    SIMULATOR_CANVAS_ID = 'simulator',
    UI_DIV_ID = 'ui',
    CAMERA_DIV_ID = 'camera',
    WIND_SPEED_DIV_ID = 'wind',
    WIND_SPEED_SPAN_ID = 'wind-speed',
    CHOPPINESS_DIV_ID = 'choppiness';

var SIZE_SLIDER_X = -200,
    SIZE_SLIDER_Z = 1100,
    SIZE_SLIDER_LENGTH = 400,
    MIN_SIZE = 100,
    MAX_SIZE = 1000,
    SIZE_SLIDER_BREADTH = 3,
    SIZE_HANDLE_SIZE = 24;

var CHOPPINESS_SLIDER_X = -1420,
    CHOPPINESS_SLIDER_Z = 75,
    CHOPPINESS_SLIDER_LENGTH = 300,
    MIN_CHOPPINESS = 0,
    MAX_CHOPPINESS = 2.5,
    CHOPPINESS_SLIDER_BREADTH = 6,
    CHOPPINESS_HANDLE_SIZE = 30;

var ARROW_TIP_RADIUS = 100,
    SIZE_HANDLE_RADIUS = 30,
    CHOPPINESS_HANDLE_RADIUS = 100;

var NONE = 0,
    ORBITING = 1,
    ROTATING = 2,
    SLIDING_SIZE = 3,
    SLIDING_CHOPPINESS = 4;

var CAMERA_DISTANCE = 1500,
    ORBIT_POINT = [-200.0, 0.0, 600.0],
    INITIAL_AZIMUTH = 0.4,
    INITIAL_ELEVATION = 0.5,
    MIN_AZIMUTH = -0.2,
    MAX_AZIMUTH = 0.5,
    MIN_ELEVATION = 0.4,
    MAX_ELEVATION = 0.8;

var log2 = function (number) {
    return Math.log(number) / Math.log(2);
};

var buildTexture = function (gl, unit, format, type, width, height, data, wrapS, wrapT, minFilter, magFilter) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, width, height, 0, gl.RGBA, gl.FLOAT, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
    return texture;
};

var buildFramebuffer = function (gl, attachment) {
    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, attachment, 0);
    return framebuffer;
};

var epsilon = function (x) {
    return Math.abs(x) < 0.000001 ? 0 : x;
};
