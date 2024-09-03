import React, { useEffect, useState } from 'react';
import { CustomNodeElementProps, RawNodeDatum, Tree, TreeNodeDatum } from 'react-d3-tree';
import NodeModal from '../../components/NodeModal/NodeModal.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateTask } from '../../services/mutations.ts';
import { useGetTask } from '../../services/queries.ts';
import { Button, FloatButton, Modal, Tooltip } from 'antd';
import {
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import './TaskPage.scss';

const TaskPage = () => {
  const [tree, setTree] = useState<any>({});
  const [node, setNode] = useState<any>();
  const [editingNode, setEditingNode] = useState<TreeNodeDatum | null>(null);
  const [nodeLines, setNodeLines] = useState<Record<string, number>>({});
  const { id } = useParams<{ id: string }>();
  const getTaskQuery = useGetTask(Number(id));
  const navigate = useNavigate();

  const updateItemTaskMutation = useUpdateTask();

  useEffect(() => {
    if (getTaskQuery.data) {
      setTree({
        name: getTaskQuery.data?.title,
        attributes: { id: 'root' },
        children: getTaskQuery.data.itemsTask.children || [],
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
      if (!curNode.children) continue;
      const len = curNode.children.length;

      for (let i = 0; i < len; i++) {
        queue.unshift(curNode.children[i]);
      }
    }
  };

  const close = () => {
    setNode(undefined);
    setEditingNode(null);
  };

  const handleNodeClick = (node: any) => {
    setNode(node);
  };

  const handleEdit = (e: React.MouseEvent, nodeDatum: TreeNodeDatum) => {
    e.stopPropagation();
    setEditingNode(nodeDatum);
  };

  const handleDelete = (e: React.MouseEvent, nodeDatum: TreeNodeDatum) => {
    e.stopPropagation();
    Modal.confirm({
      title: 'Вы уверены, что хотите удалить эту задачу?',
      icon: <ExclamationCircleOutlined />,
      content: 'Это действие нельзя будет отменить.',
      okText: 'Да, удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk() {
        if (typeof nodeDatum.attributes?.id === 'string') {
          deleteNode(nodeDatum.attributes.id);
        }
      },
    });
  };

  const deleteNode = (id: string) => {
    const newTree = removeTreeNode(tree, id);
    if (newTree) {
      setTree(newTree);
      updateItemTaskMutation.mutate([
        { ...getTaskQuery.data, itemsTask: { ...getTaskQuery.data.itemsTask, ...newTree } },
      ]);
    }
  };

  const removeTreeNode = (tree: RawNodeDatum, id: string): RawNodeDatum | null => {
    if (tree.attributes?.id === id) {
      return null;
    }
    if (tree.children) {
      const newChildren = tree.children
        .filter((child) => child.attributes?.id !== id)
        .map((child) => removeTreeNode(child, id))
        .filter(Boolean) as RawNodeDatum[];
      return { ...tree, children: newChildren };
    }
    return tree;
  };

  const handleSubmit = (treeName: string) => {
    if (editingNode) {
      const newTree = updateTreeNode(tree, editingNode.attributes?.id?.toString(), {
        name: treeName,
      });
      if (newTree) {
        setTree(newTree);
        updateItemTaskMutation.mutate([
          { ...getTaskQuery.data, itemsTask: { ...getTaskQuery.data.itemsTask, ...newTree } },
        ]);
      }
      setEditingNode(null);
    } else {
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
    }

    setNode(undefined);
  };

  const updateTreeNode = (
    tree: RawNodeDatum,
    id: string | undefined,
    updatedData: any,
  ): RawNodeDatum | null => {
    if (tree.attributes?.id === id) {
      return { ...tree, ...updatedData };
    }
    if (tree.children) {
      const newChildren = tree.children
        .map((child) => updateTreeNode(child, id, updatedData))
        .filter((child): child is RawNodeDatum => child !== null);
      return { ...tree, children: newChildren };
    }
    return null;
  };

  const getYPosition = (id: string) => {
    const lines = nodeLines[id] || 1;
    switch (lines) {
      case 1:
        return -33;
      case 2:
        return -48;
      case 3:
        return -63;
      default:
        return -33;
    }
  };

  const renderRectSvgNode = (
    customProps: CustomNodeElementProps,
    click: (datum: TreeNodeDatum) => void,
  ) => {
    const { nodeDatum } = customProps;
    const isRoot = nodeDatum.attributes?.id === 'root';
    const nodeId = nodeDatum.attributes?.id?.toString() || '';

    return (
      <g>
        <foreignObject width="120" height={50} x="-60" y={getYPosition(nodeId)}>
          <Tooltip title={nodeDatum.name}>
            <div
              className={'nodeDatumText'}
              ref={(el) => {
                if (el) {
                  const style = window.getComputedStyle(el);
                  const lineHeight = parseFloat(style.lineHeight);
                  const height = el.offsetHeight;
                  const fontSize = parseFloat(style.fontSize);

                  let lines: number;
                  if (isNaN(lineHeight)) {
                    lines = Math.round(height / (fontSize * 1.2));
                  } else {
                    lines = Math.round(height / lineHeight);
                  }

                  setNodeLines((prev) => ({ ...prev, [nodeId]: lines }));
                }
              }}
            >
              {nodeDatum.name}
            </div>
          </Tooltip>
        </foreignObject>
        <circle r="15" fill={'#a5a5a5'} style={{ cursor: 'default' }} />
        <Tooltip title="Добавить">
          <g
            style={{ position: 'relative', zIndex: 20 }}
            onClick={(e) => {
              e.stopPropagation();
              click(nodeDatum);
            }}
          >
            <circle r="8" cx="20" cy="0" fill="#4CAF50" />
            <text x="20" y="4" textAnchor="middle" style={{ fontSize: '12px', fill: 'white' }}>
              +
            </text>
          </g>
        </Tooltip>
        {!isRoot && (
          <>
            <Tooltip title="Редактировать">
              <g onClick={(e) => handleEdit(e, nodeDatum)}>
                <circle r="8" cx="-20" cy="0" fill="#2196F3" />
                <text x="-20" y="4" textAnchor="middle" style={{ fontSize: '12px', fill: 'white' }}>
                  ✎
                </text>
              </g>
            </Tooltip>
            <Tooltip title="Удалить">
              <g onClick={(e) => handleDelete(e, nodeDatum)}>
                <circle r="8" cx="0" cy="20" fill="#f44336" />
                <text x="0" y="24" textAnchor="middle" style={{ fontSize: '12px', fill: 'white' }}>
                  -
                </text>
              </g>
            </Tooltip>
          </>
        )}
      </g>
    );
  };

  const getLevelColor = (level: string | undefined) => {
    switch (level?.toLowerCase()) {
      case 'easy':
        return '#578f57';
      case 'medium':
        return 'yellow';
      case 'hard':
        return '#DA6F6F';
      default:
        return 'white';
    }
  };

  const truncateDescription = (description: string | undefined, maxLength: number = 50) => {
    if (!description) return '';
    return description.length > maxLength ? description.slice(0, maxLength) + '...' : description;
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div style={{ padding: '20px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'transparent',
          }}
        >
          <Button
            type={'text'}
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ marginRight: '20px' }}
          />
          <div
            style={{
              borderLeft: `4px solid ${getLevelColor(getTaskQuery.data?.level)}`,
              paddingLeft: '10px',
              backgroundColor: 'transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <h2 style={{ margin: '0', color: '#fff', marginRight: '10px' }}>
                {getTaskQuery.data?.title}
              </h2>
              <span
                style={{
                  color: '#4dd7a2',
                  fontWeight: 'normal',
                  fontSize: '12px',
                }}
              >
                ({getTaskQuery.data?.point} очков)
              </span>
            </div>
            <p
              style={{
                margin: '5px 0 0 0',
                color: '#a5a5a5',
                fontSize: '14px',
              }}
            >
              {truncateDescription(getTaskQuery.data?.description, 100)}
            </p>
          </div>
        </div>
      </div>
      <Tree
        data={tree}
        zoomable={true}
        onNodeClick={handleNodeClick}
        translate={{
          x: 200,
          y: 200,
        }}
        renderCustomNodeElement={(nodeInfo) => renderRectSvgNode(nodeInfo, handleNodeClick)}
        pathClassFunc={() => 'custom-path-class'}
      />
      <NodeModal
        onSubmit={handleSubmit}
        isOpen={Boolean(node) || Boolean(editingNode)}
        onClose={close}
        initialName={editingNode?.name || ''}
        mode={editingNode ? 'edit' : 'add'}
      />
      <FloatButton
        icon={<QuestionCircleOutlined />}
        type={'primary'}
        tooltip={
          <ul>
            <li>Для создания подзадачи нажмите на зеленый плюс рядом с задачей.</li>
            <li>Чтобы отредактировать задачу, используйте синюю кнопку с иконкой карандаша.</li>
            <li>Для удаления задачи нажмите на красную кнопку с минусом.</li>
            <li>Наведите курсор на текст задачи, чтобы увидеть полное описание.</li>
          </ul>
        }
        style={{ position: 'fixed', right: 24, bottom: 24 }}
      />
    </div>
  );
};
export default TaskPage;
