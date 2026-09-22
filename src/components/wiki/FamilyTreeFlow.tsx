import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FamilyTreeNode } from './FamilyTreeNode';
import {
  HOUSES_LIST,
  getHouseTree,
  saveHouseTree,
  resetHouseTree,
} from '../../data/familyTreeData';
import { saveWikiDocument } from '../../data/mockSanityData';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Check,
  X,
  LayoutGrid,
  GitFork,
  ExternalLink,
  Users,
} from 'lucide-react';

const nodeTypes = {
  characterNode: FamilyTreeNode,
};

interface FamilyTreeFlowProps {
  onSelectCharacter: (slug: string) => void;
  selectedHouseId?: string;
  onSelectHouseId?: (id: string) => void;
}

export const FamilyTreeFlow: React.FC<FamilyTreeFlowProps> = ({
  onSelectCharacter,
  selectedHouseId,
  onSelectHouseId,
}) => {
  const [internalHouseId, setInternalHouseId] = useState('stark');
  const activeHouseId = selectedHouseId || internalHouseId;
  const setActiveHouseId = onSelectHouseId || setInternalHouseId;

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isDesignMode, setIsDesignMode] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<'canvas' | 'roster'>('canvas');
  const [toastMessage, setToastMessage] = useState<string>('');

  // Modal State for Adding / Editing a Node
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formHouse, setFormHouse] = useState('');
  const [formStatus, setFormStatus] = useState<'Alive' | 'Deceased' | 'Resurrected'>('Alive');
  const [formAvatar, setFormAvatar] = useState('');
  const [formBorn, setFormBorn] = useState('');
  const [formDied, setFormDied] = useState('');
  const [formSpouse, setFormSpouse] = useState('');
  const [formParentId, setFormParentId] = useState<string>('none');

  // Load house data
  const loadTreeForHouse = useCallback(
    (houseId: string) => {
      const data = getHouseTree(houseId);
      // Attach onSelect handler to each node
      const nodesWithHandler = data.nodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          onSelect: (slug: string) => {
            if (!isDesignMode) {
              onSelectCharacter(slug);
            } else {
              setSelectedNodeId(n.id);
            }
          },
        },
      }));
      setNodes(nodesWithHandler);
      setEdges(data.edges);
    },
    [isDesignMode, onSelectCharacter, setNodes, setEdges]
  );

  useEffect(() => {
    loadTreeForHouse(activeHouseId);
  }, [activeHouseId, loadTreeForHouse]);

  // Persist node position when dragging ends
  const handleNodeDragStop = useCallback(
    () => {
      saveHouseTree(activeHouseId, { nodes, edges });
    },
    [activeHouseId, nodes, edges]
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        id: `e-${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        type: 'smoothstep',
        style: { stroke: '#d4af37', strokeWidth: 2 },
      };
      setEdges((eds) => {
        const updated = addEdge(newEdge, eds);
        saveHouseTree(activeHouseId, { nodes, edges: updated });
        return updated;
      });
    },
    [nodes, activeHouseId, setEdges]
  );

  const currentHouse = useMemo(() => {
    return HOUSES_LIST.find((h) => h.id === activeHouseId) || HOUSES_LIST[0];
  }, [activeHouseId]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setModalMode('add');
    setFormName('');
    setFormSlug('');
    setFormRole('Noble Scion');
    setFormHouse(currentHouse.name);
    setFormStatus('Alive');
    setFormAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80');
    setFormBorn('295 AC');
    setFormDied('');
    setFormSpouse('');
    setFormParentId('none');
    setIsNodeModalOpen(true);
  };

  // Open Edit Modal for Selected Node
  const handleOpenEdit = () => {
    if (!selectedNodeId) return;
    const targetNode = nodes.find((n) => n.id === selectedNodeId);
    if (!targetNode) return;

    const nodeData = targetNode.data as any;
    setModalMode('edit');
    setFormName(nodeData.name || '');
    setFormSlug(nodeData.slug || '');
    setFormRole(nodeData.role || '');
    setFormHouse(nodeData.house || currentHouse.name);
    setFormStatus(nodeData.status || 'Alive');
    setFormAvatar(nodeData.avatar || '');
    setFormBorn(nodeData.born || '');
    setFormDied(nodeData.died || '');
    setFormSpouse(nodeData.spouseName || '');
    setFormParentId('none');
    setIsNodeModalOpen(true);
  };

  const handleDeleteSelected = () => {
    if (!selectedNodeId) return;
    const targetNode = nodes.find((n) => n.id === selectedNodeId);
    const nodeName = (targetNode?.data as any)?.name || 'this character';
    if (window.confirm(`Remove ${nodeName} from the genealogical tree?`)) {
      const updatedNodes = nodes.filter((n) => n.id !== selectedNodeId);
      const updatedEdges = edges.filter(
        (e) => e.source !== selectedNodeId && e.target !== selectedNodeId
      );
      setNodes(updatedNodes);
      setEdges(updatedEdges);
      saveHouseTree(activeHouseId, { nodes: updatedNodes, edges: updatedEdges });
      setSelectedNodeId(null);
      setToastMessage(`${nodeName} removed from ${currentHouse.name} lineage.`);
      setTimeout(() => setToastMessage(''), 3500);
    }
  };

  const handleResetTree = () => {
    if (window.confirm(`Reset ${currentHouse.name} lineage tree back to canonical roster?`)) {
      const resetData = resetHouseTree(activeHouseId);
      const nodesWithHandler = resetData.nodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          onSelect: (slug: string) => {
            if (!isDesignMode) onSelectCharacter(slug);
            else setSelectedNodeId(n.id);
          },
        },
      }));
      setNodes(nodesWithHandler);
      setEdges(resetData.edges);
      setSelectedNodeId(null);
      setToastMessage(`${currentHouse.name} tree reset to canonical state.`);
      setTimeout(() => setToastMessage(''), 3500);
    }
  };

  const handleSaveNodeModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const slug =
      formSlug.trim() ||
      formName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    if (modalMode === 'add') {
      const newId = `${activeHouseId}-${Date.now().toString(36)}`;
      // Compute intelligent placement
      const parentNode = nodes.find((n) => n.id === formParentId);
      const posX = parentNode ? parentNode.position.x + 30 : 380 + Math.random() * 60;
      const posY = parentNode ? parentNode.position.y + 200 : (nodes.length * 50) % 400 + 100;

      const newNode: Node = {
        id: newId,
        type: 'characterNode',
        position: { x: posX, y: posY },
        data: {
          id: newId,
          name: formName.trim(),
          slug,
          role: formRole.trim(),
          house: formHouse.trim(),
          status: formStatus,
          avatar: formAvatar.trim(),
          born: formBorn.trim(),
          died: formDied.trim() || undefined,
          spouseName: formSpouse.trim() || undefined,
          onSelect: (s: string) => {
            if (!isDesignMode) onSelectCharacter(s);
            else setSelectedNodeId(newId);
          },
        },
      };

      const updatedNodes = [...nodes, newNode];
      let updatedEdges = [...edges];

      if (formParentId !== 'none') {
        const edgeId = `e-${formParentId}-${newId}`;
        updatedEdges.push({
          id: edgeId,
          source: formParentId,
          target: newId,
          type: 'smoothstep',
          style: { stroke: currentHouse.accentColor || '#d4af37', strokeWidth: 2 },
        });
      }

      setNodes(updatedNodes);
      setEdges(updatedEdges);
      saveHouseTree(activeHouseId, { nodes: updatedNodes, edges: updatedEdges });

      // Automatically register person in Wiki so clicking opens full article
      saveWikiDocument({
        _id: `char-${slug}`,
        _type: 'character',
        name: formName.trim(),
        slug: { current: slug },
        image: formAvatar.trim(),
        quickSummary: `${formRole.trim()} of ${currentHouse.name}. Born ${formBorn || 'unknown'}.`,
        status: formStatus,
        allegiances: [{ _id: `house-${activeHouseId}`, _type: 'house', name: currentHouse.name, slug: { current: `house-${activeHouseId}` } }],
        biography: [
          {
            _type: 'block',
            _key: `bio-${newId}`,
            style: 'normal',
            children: [{ _key: `spn-${newId}`, _type: 'span', text: `${formName.trim()} is chronicled in the lineages of ${currentHouse.name}. Recorded as ${formRole.trim()}.` }],
          },
        ],
      });

      setToastMessage(`Added "${formName.trim()}" to ${currentHouse.name} family tree!`);
      setTimeout(() => setToastMessage(''), 4000);
    } else if (modalMode === 'edit' && selectedNodeId) {
      const updatedNodes = nodes.map((n) => {
        if (n.id === selectedNodeId) {
          return {
            ...n,
            data: {
              ...n.data,
              name: formName.trim(),
              slug,
              role: formRole.trim(),
              house: formHouse.trim(),
              status: formStatus,
              avatar: formAvatar.trim(),
              born: formBorn.trim(),
              died: formDied.trim() || undefined,
              spouseName: formSpouse.trim() || undefined,
            },
          };
        }
        return n;
      });

      setNodes(updatedNodes);
      saveHouseTree(activeHouseId, { nodes: updatedNodes, edges });
      setToastMessage(`Updated "${formName.trim()}" in ${currentHouse.name} tree.`);
      setTimeout(() => setToastMessage(''), 3500);
    }

    setIsNodeModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-950 rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs shadow-2xl flex items-center gap-2 border border-amber-400">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar with House Selection & Design Mode Controls */}
      <div className="bg-neutral-900 border-b border-neutral-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* House Selection Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <span className="text-[11px] font-mono uppercase text-neutral-500 mr-1 shrink-0 hidden sm:inline">
            House:
          </span>
          {HOUSES_LIST.map((h) => {
            const isSelected = h.id === activeHouseId;
            return (
              <button
                key={h.id}
                onClick={() => {
                  setActiveHouseId(h.id);
                  setSelectedNodeId(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-amber-600 text-neutral-950 shadow-md shadow-amber-950 font-bold scale-105'
                    : 'bg-neutral-950 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <span>{h.sigil}</span>
                <span className="font-serif">{h.name}</span>
              </button>
            );
          })}
        </div>

        {/* View Mode & Designer Actions */}
        <div className="flex items-center gap-2">
          {/* View Tab Toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
            <button
              onClick={() => setViewTab('canvas')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
                viewTab === 'canvas'
                  ? 'bg-neutral-800 text-amber-300 font-medium'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Interactive Family Tree Canvas"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Canvas</span>
            </button>
            <button
              onClick={() => setViewTab('roster')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
                viewTab === 'roster'
                  ? 'bg-neutral-800 text-amber-300 font-medium'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Lineage Members Roster"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Roster ({nodes.length})</span>
            </button>
          </div>

          {/* Design Mode Toggle */}
          <button
            onClick={() => {
              setIsDesignMode(!isDesignMode);
              setSelectedNodeId(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              isDesignMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 ring-1 ring-amber-500/50'
                : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isDesignMode ? 'Editing Active' : 'Design / Edit Tree'}</span>
          </button>

          {isDesignMode && (
            <>
              <button
                onClick={handleOpenAdd}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-950 transition-colors font-serif"
                title="Add member to family tree"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>

              {selectedNodeId && (
                <>
                  <button
                    onClick={handleOpenEdit}
                    className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs flex items-center gap-1 transition-colors"
                    title="Edit selected character"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="px-2.5 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800/80 text-red-300 text-xs flex items-center gap-1 transition-colors"
                    title="Delete selected character"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </>
              )}

              <button
                onClick={handleResetTree}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs flex items-center gap-1 transition-colors"
                title="Reset Tree to Canonical Lineage"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* House Motto Banner */}
      <div className="bg-neutral-950/90 px-4 sm:px-6 py-2 border-b border-neutral-850 flex items-center justify-between text-xs text-neutral-400 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-serif italic text-amber-300 font-semibold">"{currentHouse.motto}"</span>
          <span className="text-neutral-600">•</span>
          <span>Seat: {currentHouse.seat}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500">
          <span>{nodes.length} Personages</span>
          {isDesignMode ? (
            <span className="text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
              Drag nodes to arrange • Click to select
            </span>
          ) : (
            <span className="hidden sm:inline text-neutral-400">
              Click character card to read full wiki article
            </span>
          )}
        </div>
      </div>

      {/* Main Content: Canvas View OR Roster View */}
      {viewTab === 'canvas' ? (
        <div className="w-full h-[640px] bg-neutral-950 relative min-h-[500px]">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={handleConnect}
              onNodeDragStop={handleNodeDragStop}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.2}
              maxZoom={2}
              attributionPosition="bottom-left"
              className="bg-neutral-950"
            >
              <Background color="#2a2a2a" gap={24} size={1} />
              <Controls className="!bg-neutral-900 !border-neutral-800 !text-neutral-200" />
              <MiniMap
                nodeColor={currentHouse.accentColor || '#d4af37'}
                maskColor="rgba(10, 10, 10, 0.85)"
                className="!bg-neutral-900 !border !border-neutral-800 !rounded-xl overflow-hidden"
              />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      ) : (
        /* Roster View: Guaranteed Card Grid of all House Members */
        <div className="w-full h-[640px] overflow-y-auto p-6 bg-neutral-950">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-800">
              <div>
                <h3 className="text-xl font-bold font-serif-title text-neutral-100 flex items-center gap-2">
                  <span>{currentHouse.sigil}</span>
                  <span>{currentHouse.name} Lineage Roster</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Complete list of all recorded members of this noble dynasty.
                </p>
              </div>
              <button
                onClick={handleOpenAdd}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-950 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {nodes.map((node) => {
                const data = node.data as any;
                const isAlive = data.status === 'Alive';
                return (
                  <div
                    key={node.id}
                    className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-600/50 transition-all flex flex-col justify-between group"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 overflow-hidden shrink-0">
                        {data.avatar ? (
                          <img
                            src={data.avatar}
                            alt={data.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg text-neutral-600 font-serif">
                            {data.name?.[0]}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-sm font-bold text-neutral-100 font-serif truncate group-hover:text-amber-300 transition-colors">
                            {data.name}
                          </h4>
                          <span
                            className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded shrink-0 ${
                              isAlive
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                                : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                            }`}
                          >
                            {data.status}
                          </span>
                        </div>
                        <p className="text-xs text-amber-400 font-medium truncate mt-0.5">
                          {data.role}
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-1 font-mono">
                          Born {data.born || 'Unknown'}{data.died ? ` • Died ${data.died}` : ''}
                        </p>
                        {data.spouseName && (
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Spouse: <span className="text-neutral-300">{data.spouseName}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs">
                      <button
                        onClick={() => onSelectCharacter(data.slug)}
                        className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>View Article</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedNodeId(node.id);
                            handleOpenEdit();
                          }}
                          className="text-neutral-400 hover:text-neutral-200 text-[11px] flex items-center gap-0.5"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedNodeId(node.id);
                            handleDeleteSelected();
                          }}
                          className="text-neutral-500 hover:text-red-400 text-[11px] flex items-center gap-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Del</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Family Member Modal */}
      {isNodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <h3 className="text-lg font-bold font-serif-title text-neutral-100 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <span>{modalMode === 'add' ? `Add Member to ${currentHouse.name}` : 'Edit Member'}</span>
              </h3>
              <button
                onClick={() => setIsNodeModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNodeModal} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Cregan Stark"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="e.g. cregan-stark"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Role / Title</label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="e.g. Lord of Winterfell"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Alive">Alive</option>
                    <option value="Deceased">Deceased</option>
                    <option value="Resurrected">Resurrected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Portrait Avatar URL</label>
                <input
                  type="text"
                  value={formAvatar}
                  onChange={(e) => setFormAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Born Year</label>
                  <input
                    type="text"
                    value={formBorn}
                    onChange={(e) => setFormBorn(e.target.value)}
                    placeholder="e.g. 263 AC"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Died Year</label>
                  <input
                    type="text"
                    value={formDied}
                    onChange={(e) => setFormDied(e.target.value)}
                    placeholder="e.g. 298 AC"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Spouse Name</label>
                  <input
                    type="text"
                    value={formSpouse}
                    onChange={(e) => setFormSpouse(e.target.value)}
                    placeholder="e.g. Catelyn Tully"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {modalMode === 'add' && (
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Parent (Connect in Tree)</label>
                  <select
                    value={formParentId}
                    onChange={(e) => setFormParentId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="none">-- No Parent (Root / Top-level) --</option>
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {(n.data as any).name} ({(n.data as any).role})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNodeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-950 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{modalMode === 'add' ? 'Save & Add Person' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyTreeFlow;
