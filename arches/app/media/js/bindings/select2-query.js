define([
    'jquery',
    'knockout',
    'underscore',
    'select-woo'
], function($, ko, _) {
    ko.bindingHandlers.select2Query = {
        init: function(el, valueAccessor, allBindingsAccessor) {
            var allBindings = allBindingsAccessor().select2Query;
            var select2Config = ko.utils.unwrapObservable(allBindings.select2Config);
            select2Config = Object.assign({}, select2Config);
            select2Config = _.defaults(select2Config, {
                clickBubble: true,
                multiple: false,
                allowClear: false,
                minimumResultsForSearch: 8
            });
            var value = select2Config.value;
            var attr = allBindingsAccessor()?.attr;
            if(!!attr && Object.hasOwn(attr, 'data-label')){
                el.setAttribute('aria-label', attr['data-label']);
            }

            ko.utils.domNodeDisposal.addDisposeCallback(el, function() {
                $(el).selectWoo('destroy');
                $(el).off("select2:selecting");
                $(el).off("select2:opening");
                $(el).off("change");
            });

            var placeholder = select2Config.placeholder;
            if (ko.isObservable(placeholder)) {
                placeholder.subscribe(function(newItems) {
                    select2Config.placeholder = newItems;
                    $(el).selectWoo(select2Config);
                }, this);
                select2Config.placeholder = select2Config.placeholder();
                if (select2Config.allowClear) {
                    select2Config.placeholder = select2Config.placeholder === "" ? " " : select2Config.placeholder;
                }
            }

            var disabled = select2Config.disabled;
            if (ko.isObservable(disabled)) {
                disabled.subscribe(function(isdisabled) {
                    select2Config.disabled = isdisabled;
                    $(el).selectWoo("destroy").selectWoo(select2Config);
                });
                select2Config.disabled = select2Config.disabled();
            }

            // this initializes the placeholder for the single select element
            // we shouldn't have to do this but there is some issue with selectwoo
            // specifically rendering the placeholder for resource instance widgets in adv. search
            var renderPlaceholder = function() {
                var renderedEle = $(el).siblings().first().find('.select2-selection__rendered');
                var placeholderEle = renderedEle.find('.select2-selection__placeholder');
                if (placeholderEle[0]?.innerText === "" && !select2Config.multiple){
                    placeholderEle.remove();
                    var placeholderHtml = document.createElement("span");
                    var placeholderText = document.createTextNode(select2Config.placeholder);
                    placeholderHtml.classList.add('select2-selection__placeholder');
                    placeholderHtml.appendChild(placeholderText);
                    renderedEle.append(placeholderHtml);
                }
            };

            $(document).ready(function() {
                select2Config.data = ko.unwrap(select2Config.data);
                $(el).selectWoo(select2Config);
                
                if (value) {
                    value.extend({ rateLimit: 250 });
                    // initialize the dropdown with the value
                    $(el).val(value());
                    $(el).trigger('change.select2'); 
    
                    // update the dropdown if something else changes the value
                    value.subscribe(function(newVal) {
                        console.log(newVal);
                        // select2Config.value = newVal;
                        $(el).val(newVal);
                        $(el).trigger('change.select2');

                        if(!newVal){
                            renderPlaceholder();
                        }
                    }, this);
                }
                renderPlaceholder();
            });

            
            $(el).on("change", function(e) {
                let val = $(el).val();
                if (val === "") {
                    val = null;
                }
                value(val);
            });
            
            $(el).on("select2:opening", function() {
                if (select2Config.clickBubble) {
                    $(el).parent().trigger('click');
                }
            });
            
            if (typeof select2Config.onSelect === 'function') {
                $(el).on("select2:selecting", function(e) {
                    select2Config.onSelect(e.params.args.data);
                });
            }
        }
    };

    return ko.bindingHandlers.select2;
});
