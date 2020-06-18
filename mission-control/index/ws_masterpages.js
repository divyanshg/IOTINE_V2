function _adjustMasterPage() {

	var $section = $("#content-body");
	var $master = $section.find(".master-element");
	var $parent = $master.parent();
	var collapse = $master.hasClass('master-collapse');

	if($section.hasClass('master-page-adjusted')) {
		return;
	}

	if($parent.length === 1 && !window.skipAdjustMasterPage) {

		if ($master[0].newSectionHeight) {
			$section.height($master[0].newSectionHeight);
			$section.addClass("master-page-adjusted");
			return;
		}

		var masterPosition = $parent.position();

		var masterTop = masterPosition.top;
		var masterHeight = $parent.outerHeight();
		var masterBottom = masterTop + masterHeight;

		var masterLeft = masterPosition.left;
		var masterWidth = $parent.outerWidth();
		var masterRight = masterLeft + masterWidth;

		var renderHeight = $master.outerHeight();
		var renderBottom = masterTop + renderHeight;
		
		var offsetHeight = renderBottom > masterBottom ? renderBottom - masterBottom : 0;
		
		var $elements = $section.find(".element").not($parent);
		
		var elementsMaxHeight = _getElementMaxHeight($elements,$parent);

		var $bottomElement = _getBottomElement($elements,$parent);
		var orgBottomElementDiff = $section.height();
		if(typeof $bottomElement !== "undefined") {
			orgBottomElementDiff -= ($bottomElement.position().top + $bottomElement.outerHeight());
		} else {
			orgBottomElementDiff -= ($parent.position().top + $parent.outerHeight());
		}

		// get offsetHeight if collapse
		if (collapse && renderBottom < masterBottom) {
			offsetHeight = renderBottom - masterBottom;
			var maxCollapseBottom = renderBottom;
			var bottomElementsTop = elementsMaxHeight;
			$elements.each(function() {
				var $this = $(this), thisPos = $this.position(), 
					thisTop = thisPos.top, thisBottom = thisTop + $this.outerHeight(); 
				if(thisBottom < masterBottom) {
					maxCollapseBottom = Math.max(maxCollapseBottom, thisBottom);
				} else if (thisTop >= masterBottom){
					bottomElementsTop = Math.min(bottomElementsTop, thisTop);
				}
			});
			offsetHeight = Math.max(offsetHeight, maxCollapseBottom - bottomElementsTop);
		}

		var newSectionHeight = renderBottom;
		$elements.each(function() {
			var $this = $(this);
			var thisPos = $this.position();
			var thisTop = thisPos.top;

			if(thisTop >= masterBottom) {
				var thisLeft = thisPos.left;
				var thisWidth = $this.outerWidth();
				var thisRight = thisLeft + thisWidth;

				if(thisLeft <= masterRight && thisRight >= masterLeft) {

					var newTop = thisTop;
					// if(offsetHeight > 0 || $("body").hasClass("mobile-mode")){
					if(offsetHeight !== 0 || $("body").hasClass("mobile-mode")){
						newTop = thisTop + offsetHeight;
						if(typeof App !== "undefined" && App.isPreview){
							setTimeout(function(){
								$this.css("top", newTop);
							},300);
						} else {
							$this.css("top", newTop);
						}
					}
					
					if(!$this.hasClass("strip-element")){
						var thisHeight = $this.outerHeight();
						newSectionHeight = Math.max(newSectionHeight, newTop + thisHeight);
					}
				}
			}
		});

		if (collapse) {
			$parent.outerHeight(renderHeight);
			$bottomElement = _getBottomElement($elements,$parent);
			orgBottomElementDiff = $section.height() - elementsMaxHeight || 0;
			elementsMaxHeight = _getElementMaxHeight($elements,$parent);
		}

		if($bottomElement) {
			newSectionHeight = (Math.max(newSectionHeight, $bottomElement.position().top + $bottomElement.outerHeight())) + orgBottomElementDiff;
			if(newSectionHeight < elementsMaxHeight){
				newSectionHeight = elementsMaxHeight;
			}
			if(newSectionHeight > 0 && (collapse || newSectionHeight > $section.height())) {
				$section.height(newSectionHeight);
			}
		} else {
			newSectionHeight += orgBottomElementDiff;
			if(newSectionHeight < elementsMaxHeight){
				newSectionHeight = elementsMaxHeight;
			}
			if(newSectionHeight > 0) {
				$section.height(newSectionHeight);
			}
		}

		$master[0].newSectionHeight = $section.height();
		$section.addClass("master-page-adjusted");
		$parent.outerHeight(renderHeight);
	}
}

function _revertMasterPage() {

	var $section = $("#content-body");
	var $master = $section.find(".master-element");
	var $parent = $master.parent();

	if($section.hasClass("master-page-adjusted") && $parent.length === 1) {
		$section.removeClass("master-page-adjusted").find(".element").not(this.$el).trigger("revertPosition");
		delete $master[0].newSectionHeight;

		var contentHeight = App.editorMode === 'mobile' ? App.sectionHeights.mobile['content-body'] : App.sectionHeights.desktop['content-body'];
		$section.height(contentHeight);
	}
}

function _getBottomElement($elements,$parent) {
	var $el, masterBottom = $parent.position().top + $parent.outerHeight();
	$elements.each(function() {
		var $t = $(this), elTop = $t.position().top;
		if(elTop > masterBottom && (typeof $el == "undefined" || typeof $el !== "undefined" && elTop > $el.position().top)) {
			$el = $(this);
		}
	});
	return $el;
}

function _getElementMaxHeight($elements,$parent) {
	var h = $parent.position().top + $parent.outerHeight();
	$elements.each(function() {
		var $t = $(this), elHeight = $t.position().top + $t.outerHeight();
		if(elHeight > h && !$t.hasClass("strip-element")) {
			h = elHeight;
		}
	});
	return h;
}