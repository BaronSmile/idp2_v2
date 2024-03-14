import { useEffect, useState } from 'react';
import { CustomNodeElementProps, RawNodeDatum, Tree, TreeNodeDatum } from 'react-d3-tree';
import NodeModal from '../../components/NodeModal/NodeModal.tsx';
import { useParams } from 'react-router-dom';
import { useUpdateTask } from '../../services/mutations.ts';
import { useGetTask } from '../../services/queries.ts';

const TaskPage = () => {
  const [tree, setTree] = useState<any>({});
  const [node, setNode] = useState<TreeNodeDatum | undefined>();
  const { id } = useParams<{ id: string }>();
  const getTaskQuery = useGetTask(Number(id));

  const updateItemTaskMutation = useUpdateTask();

  useEffect(() => {
    if (getTaskQuery.data) {
      setTree({
        name: getTaskQuery.data?.title,
        attributes: { id: 'root' },
        children: [getTaskQuery.data.itemsTask],
      });
    }
  }, [getTaskQuery.data]);

  const bfs = (id: string, tree: RawNodeDatum | RawNodeDatum[], node: RawNodeDatum) => {
    const queue: RawNodeDatum[] = [];
    queue.unshift(tree as RawNodeDatum);

    while (queue.length > 0) {
      const curNode = queue.pop();
      if (!curNode) continue;
      if (curNode.attributes?.id === id) {
        curNode.children?.push(node);

        return { ...tree };
      }

      const len = curNode.children.length;

      for (let i = 0; i < len; i++) {
        queue.unshift(curNode.children[i]);
      }
    }
  };

  const close = () => {
    setNode(undefined);
  };

  const handleNodeClick = (node: TreeNodeDatum) => {
    setNode(node);
  };

  const handleSubmit = (treeName: string) => {
    const newTree = bfs(node?.attributes?.id, tree, {
      name: treeName,
      attributes: { id: Date.now().toString() },
      children: [],
    });

    if (newTree) {
      setTree(newTree);
      updateItemTaskMutation.mutate([
        { ...getTaskQuery.data, itemsTask: { ...getTaskQuery.data.itemsTask, ...newTree } },
      ]);
    }

    setNode(undefined);
  };

  const renderRectSvgNode = (
    customProps: CustomNodeElementProps,
    click: (datum: TreeNodeDatum) => void,
  ) => {
    const { nodeDatum } = customProps;

    return (
      <g onClick={() => click(nodeDatum)}>
        <circle r="15" fill={'#777'} />
        <text x="20" y="-5" fill="white" strokeWidth="0.5">
          {nodeDatum.name}
        </text>
      </g>
    );
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Tree
        data={tree}
        zoomable={true}
        onNodeClick={handleNodeClick}
        translate={{
          x: 200,
          y: 200,
        }}
        renderCustomNodeElement={(nodeInfo) => renderRectSvgNode(nodeInfo, handleNodeClick)}
      />
      <NodeModal
        onSubmit={(treeName) => handleSubmit(treeName)}
        isOpen={Boolean(node)}
        onClose={close}
      />
    </div>
  );
};
export default TaskPage;
