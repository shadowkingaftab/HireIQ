import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function SkillGraph({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Transform data if it's in the old format (nodes as object, edges as array)
    const nodes = Array.isArray(data.nodes) 
      ? data.nodes 
      : Object.entries(data.nodes).map(([id, node]) => ({ id, ...node }));
    
    const links = data.links || data.edges || [];

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous graph

    const width = svgRef.current.clientWidth || 600;
    const height = 400;

    // Create a force simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    // Create links
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#e2e8f0")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.6);

    // Create nodes
    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", d => 15 + (d.weight || 0.5) * 15)
      .attr("fill", d => {
        const colors = {
          "Language": "#4f46e5",    // Indigo
          "Framework": "#10b981",   // Emerald
          "Tool": "#f59e0b",        // Amber
          "Database": "#ef4444",    // Red
          "Cloud": "#0ea5e9"        // Sky
        };
        return colors[d.category] || "#94a3b8";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .style("cursor", "grab")
      .call(
        d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    // Add labels
    const labels = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .enter().append("text")
      .text(d => d.id)
      .attr("font-size", 11)
      .attr("font-weight", "800")
      .attr("text-anchor", "middle")
      .attr("fill", "#1e293b")
      .attr("pointer-events", "none")
      .attr("dy", d => 25 + (d.weight || 0.5) * 15);

    // Update positions
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      labels
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <div className="mt-8 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Intelligence Graph</h3>
          <p className="text-sm text-gray-500 font-medium">Neural visualization of your verified capability.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
            <span className="text-xs font-bold text-gray-400 uppercase">Lang</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-bold text-gray-400 uppercase">Framework</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 rounded-[32px] border border-gray-100 overflow-hidden relative group">
        <svg ref={svgRef} height="400" className="w-full"></svg>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Interactive: Drag nodes to explore relationships
        </div>
      </div>
    </div>
  );
}
