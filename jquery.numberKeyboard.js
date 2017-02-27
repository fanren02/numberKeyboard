(function($) {
    $.fn.numberKeyboard = function(options) {
        var opts;
        opts = $.extend({}, $.fn.numberKeyboard.defaults, options);
        opts.Input = this;
        var keys = '';
        for (var i = 1; i <= 9; i++) {
            keys += '<div class="key" data-key="' + i + '">' + i + '</div>';
        }
        if (opts.dot === false) {
            keys += '<div class="key" data-key="">&nbsp;</div>';
        } else {
            keys += '<div class="key dot" data-key=".">·</div>';
        }
        keys += '<div class="key" data-key="0">0</div>';
        keys += '<div class="key backspace" data-key="-1">&nbsp;</div>';

        var domNode = this.domNode = $('<div class="number-keyboard"><div class="key-area">' + keys + '</div></div>');
        
        var closestKey = function(node) {
            var key = null;
            while (node && node !== domNode) {
                if ($(node).hasClass('key')) {
                    key = node;
                    break;
                }
                node = node.parentNode;
            }
            return key;
        };
        var lastMouseDownKey = null;
        ['touchstart', 'mousedown'].forEach(function(type) {
            return domNode.on(type, function(e) {
                return lastMouseDownKey = closestKey(e.target);
            });
        });
        ['touchend', 'mouseup'].forEach(function(type) {
            domNode.on(type, function(e) {
                e.preventDefault();
                var currentKey = closestKey(e.target);
                if (currentKey && currentKey === lastMouseDownKey) {
                    opts.onKey({
                        key: $(currentKey).data('key'),
                        target: currentKey
                    });
                }
                lastMouseDownKey = null;
            });
        });
        if (opts.target !== false){
            domNode.appendTo($(opts.target));
        }
        return this;
    };
    $.fn.numberKeyboard.defaults = {
        onKey: function(e) {
            var key = e.key.toString(), input = $(this.Input), nodeName = input[0].nodeName;
            
            var value = nodeName !== 'INPUT' ? input.text() : input.val();
            
            if (key === '-1') {
                newValue = value.substring(0, value.length - 1);
            } else {
                if (key === '.') {
                    if (value === '') {
                        newValue = '0.';
                    } else {
                        //only one . should be present
                        if (value.indexOf('.') === -1) {
                            newValue = value + key;
                        }
                    }
                } else {
                    //only one leading 0 should be present
                    var newValue = value === '0' ? key : value + key;
                    var i = newValue.indexOf('.');
                    //maximum two digits
                    if (i !== -1 && newValue.length - 1 - i > 2) {
                        return;
                    }
                }
            }
            newValue = newValue === '' ? this.default : newValue;
            nodeName !== 'INPUT' ? input.text(newValue) : input.val(newValue);
        },
        dot: true,
        target: 'body',
        default: ''
    };
})(jQuery);