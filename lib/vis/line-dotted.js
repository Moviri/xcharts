(function () {
  var line = _vis.line;

  function enter(self, storage, className, data, callbacks) {
    var circles;

    line.enter(self, storage, className, data, callbacks);

    circles = storage.lineContainers.selectAll('circle')
      .data(function (d) {
        return d.data;
      }, function (d) {
        return d.x;
      });

    circles.enter().append('circle')
      .style('opacity', 0)
      .attr('cx', storage.lineX)
      .attr('cy', storage.lineY)
      .attr('r', 2)
      .on('mouseover', callbacks.mouseover)
      .on('mouseout', callbacks.mouseout)
      .on('click', callbacks.click);

    storage.lineCircles = circles;
    
    var annotationTexts;
    var annotationRects;
    var annotationData;
    if (data.length && data[0].annotations)
	{
    	annotationData = data[0].annotations; 
	
    	annotationTexts = storage.lineContainers.selectAll('text')
        .data(function (d) {
          return d.annotations || {};
        }, function (d) {
          return d.x || 0;
        });

    	annotationTexts.enter().append('text')
        .style('opacity', 0)
        .attr('x', storage.lineX)
        .attr('y', function (d) { return storage.lineY(d) - 30 })
        .attr('text-anchor', 'middle')
        .attr('class', 'xchart-annotation-text')
        .attr('fill', 'blue')
        .text(function(d) {
            return (d.letter)
          });

    	annotationRects = storage.lineContainers.selectAll('rect')
        .data(function (d) {
    	  return d.annotations || {};
        }, function (d) {
          return d.x || 0;
        });

    	annotationRects.enter().append('rect')
        .style('opacity', 0)
        .attr('x', function (d) { return storage.lineX(d) - 10 }) // temporary. update function will set the definitive
        .attr('y', function (d) { return storage.lineY(d) - 42 }) // temporary. update function will set the definitive
        .attr('width', 18) // temporary. update function will set the definitive
        .attr('height', 18) // temporary. update function will set the definitive
        .attr('class', 'xchart-annotation-rect')
        .style('fill', '#ddd')
        .style('stroke', '#999')
        .style('stroke-width', 1)
        .on('mouseover', callbacks.mouseoverAnnotation)
        .on('mouseout', callbacks.mouseoutAnnotation)

    	annotationLines = storage.lineContainers.selectAll('line')
        .data(function (d) {
          return d.annotations || {};
        }, function (d) {
          return d.x || 0;
        });

    	annotationLines.enter().append('line')
        .attr('y1', storage.lineY)
        .attr('y2', function (d) { return storage.lineY(d) - 24 })
        .attr('x1', storage.lineX)
        .attr('x2', storage.lineX)
        .style('stroke', '#999')
        .style('stroke-width', 1)
        
    	storage.lineAnnotationTexts = annotationTexts;
    	storage.lineAnnotationRects = annotationRects;
    	storage.lineAnnotationLines = annotationLines;
	}

  }

  function update(self, storage, timing) {
    line.update.apply(null, _.toArray(arguments));

    storage.lineCircles.transition().duration(timing)
      .style('opacity', 1)
      .attr('cx', storage.lineX)
      .attr('cy', storage.lineY);
    
    var fontsize = 12;
    function multiplier(d) {
    	return (storage.lineY(d) < 45 ? 0.5 : 1)
    }
    if (storage.lineAnnotationTexts)
	{
        fontsize = storage.lineAnnotationTexts.node().clientHeight || 12;

        storage.lineAnnotationTexts.transition().duration(timing)
	    	.style('opacity', 1)
	        .attr('x', storage.lineX)
	        .attr('y', function (d) { return storage.lineY(d) - 28*multiplier(d) })
	}

    if (storage.lineAnnotationRects)
        storage.lineAnnotationRects.transition().duration(timing)
        	.style('opacity', 0.7)
            .attr('x', function (d) { return storage.lineX(d) - (fontsize/2 + 2)  })
            .attr('y', function (d) { return storage.lineY(d) - (fontsize/2 + 2 + 34*multiplier(d)) })
		    .attr('width', fontsize + 4)
		    .attr('height', fontsize + 4)

    
    if (storage.lineAnnotationLines)
        storage.lineAnnotationLines.transition().duration(timing)
        	.style('opacity', 0.7)
            .attr('y1', storage.lineY)
            .attr('y2', function (d) { return storage.lineY(d) + (fontsize/2 - 2 - 28*multiplier(d)) })
            .attr('x1', storage.lineX)
            .attr('x2', storage.lineX)
  }

  function exit(self, storage) {
    storage.lineCircles.exit()
      .remove();
    
    if (storage.lineAnnotationTexts)
    	storage.lineAnnotationTexts.exit().remove();
    	
    if (storage.lineAnnotationRects)
    	storage.lineAnnotationRects.exit().remove();
    
    if (storage.lineAnnotationLines)
    	storage.lineAnnotationLines.exit().remove();
    
    line.exit.apply(null, _.toArray(arguments));
  }

  function destroy(self, storage, timing) {
    line.destroy.apply(null, _.toArray(arguments));
    if (!storage.lineCircles) {
      return;
    }
    storage.lineCircles.transition().duration(timing)
      .style('opacity', 0);
    
    if (storage.lineAnnotationTexts)
        storage.lineAnnotationTexts.transition().duration(timing)
        	.style('opacity', 0);
    
    if (storage.lineAnnotationRects)
        storage.lineAnnotationRects.transition().duration(timing)
        	.style('opacity', 0);
    
    if (storage.lineAnnotationLines)
        storage.lineAnnotationLines.transition().duration(timing)
        	.style('opacity', 0);
  }

  _vis['line-dotted'] = {
    enter: enter,
    update: update,
    exit: exit,
    destroy: destroy
  };
}());
