import { Button, Card, Divider, Form, Input, InputNumber, Modal, Popconfirm, Select, Table, Tooltip, message, notification } from 'antd';
import { DeleteOutlined, EditOutlined, FileAddFilled, WarningOutlined } from '@ant-design/icons';
import { IntlShape, useIntl, useModel } from 'umi';
import { LoadingObject, modalFormLayout } from '@/utils/utils';
import React, { useEffect, useState } from 'react';

import { ColumnProps } from 'antd/lib/table/Column';
import ColumnTitle from '@/components/ColumnTitle';
import { Guid } from 'guid-typescript';
import { PageContainer } from '@ant-design/pro-layout';
import { Store } from 'antd/lib/form/interface';
import moment from 'moment';
import { useForm } from 'antd/lib/form/util';

const Menu: React.FC<{}> = () => {
  const intl: IntlShape = useIntl();
  const [searchForm] = useForm();
  const [modalForm] = useForm();

  const { itemList, loading, getMenuTable, addMenu, delMenu, editMenu, getLoadMenu, loadMenuForm } = useModel('useMenuModel');
  const { loading: roleLoading } = useModel('useMenuModel');
  const { functions, getFunctions } = useModel('function');
  const [parentNumber, setparentNumber] = useState<string>('');
  const [depth, setdepth] = useState<number>(0);
  const [parentId, setparent] = useState<string>('');
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalModel, setModalModel] = useState<string>('create');
  const [modalTitle, setModalTitle] = useState<string>('user.modal.title.create');
  const [itemId, setItemId] = useState<string>('');
  useEffect(() => {
    getMenuList();
  }, []);
  useEffect(() => {
    getFunctions();
  }, []);
  const columns: Array<ColumnProps<MenuDto.MenuTable>> = [
    {
      title: (
        <ColumnTitle
          name={intl.formatMessage({
            id: 'menu.table.columns.name'
          })}
        />
      ),
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: (
        <ColumnTitle
          name={intl.formatMessage({
            id: 'menu.table.columns.path'
          })}
        />
      ),
      dataIndex: 'path',
      key: 'path',
      align: 'center'
    },
    {
      title: (
        <ColumnTitle
          name={intl.formatMessage({
            id: 'menu.table.columns.description'
          })}
        />
      ),
      dataIndex: 'description',
      key: 'description',
      align: 'center'
    },
    {
      title: (
        <ColumnTitle
          name={intl.formatMessage({
            id: 'menu.table.columns.icon'
          })}
        />
      ),
      dataIndex: 'icon',
      key: 'icon',
      align: 'center'
    },
    {
      title: (
        <ColumnTitle
          name={intl.formatMessage({
            id: 'menu.table.columns.sort'
          })}
        />
      ),
      dataIndex: 'sort',
      key: 'sort',
      align: 'center'
    },
    {
      title: (
        <ColumnTitle
          name={intl.formatMessage({
            id: 'menu.table.columns.component'
          })}
        />
      ),
      dataIndex: 'component',
      key: 'component',
      align: 'center'
    },
    {
      title: (
        <ColumnTitle
          name={intl.formatMessage({
            id: 'menu.table.columns.depth'
          })}
        />
      ),
      dataIndex: 'depth',
      key: 'depth',
      align: 'center'
    },
    {
      title: <ColumnTitle name={intl.formatMessage({ id: 'menu.table.columns.operating' })} />,
      key: 'action',
      align: 'center',
      render: (_: string, record: MenuDto.MenuTable) => (
        <div>
          <Tooltip placement="bottom" title={intl.formatMessage({ id: 'menu.table.columns.tooltip.add' })}>
            <FileAddFilled onClick={() => onCreateChildrenClick(record)} />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip placement="bottom" title={intl.formatMessage({ id: 'menu.table.columns.tooltip.modify' })}>
            <EditOutlined onClick={() => onEditClick(record)} />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip placement="bottom" title={intl.formatMessage({ id: 'menu.table.columns.tooltip.delete' })}>
            <Popconfirm placement="top" title={intl.formatMessage({ id: 'menu.table.columns.tooltip.title' })} onConfirm={() => onDeleteClick(record.id!)} icon={<WarningOutlined />}>
              <DeleteOutlined style={{ color: 'red', fontSize: 16 }} />
            </Popconfirm>
          </Tooltip>
        </div>
      )
    }
  ];

  const onDeleteClick = (id: string) => {
    delMenu(id)
      .then(() => {
        message.success(intl.formatMessage({ id: 'user.function.delete.click.success' }));
        getMenuList();
      })
      .catch((error: Error) => message.error(`${intl.formatMessage({ id: 'user.function.delete.click.fail' })}:${error}`));
  };
  const onEditClick = (record: MenuDto.MenuTable) => {
    setModalModel('edit');
    setModalTitle('modal.title.modify');
    setItemId(record.id!);
    getLoadMenu(record.id).then(() => {
      let data = loadMenuForm;
      debugger;
      setparent(data.parentId);
      setdepth(data.depth);
      setparentNumber(data.parentNumber);
      modalForm.setFieldsValue({
        name: data.name,
        component: data.component,
        icon: data.icon,
        path: data.path,
        sort: data.sort,
        description: data.description,
        func: data.functionIds
      });
    });
    setModalShow(true);
  };

  const handleReset = () => {
    searchForm.resetFields();
    handleSearch({});
  };
  const handleSearch = (values: Store) => {};
  const onCreateChildrenClick = (record: MenuDto.MenuTable) => {
    setparent(record.id);
    setdepth(record.depth + 1);
    setparentNumber(record.parentNumber + ',' + record.id);
    setModalModel('create');
    setModalTitle('modal.title.create');
    modalForm.setFieldsValue({
      name: '',
      component: '',
      icon: '',
      path: '',
      sort: 0,
      func: [],
      description: ''
    });
    setItemId('');
    setModalShow(true);
  };
  const onCreateClick = () => {
    setModalModel('create');
    setModalTitle('modal.title.create');
    setparent(Guid.EMPTY);
    modalForm.setFieldsValue({
      name: '',
      component: '',
      icon: '',
      path: '',
      sort: 0,
      func: [],
      description: ''
    });
    setItemId('');
    setModalShow(true);
  };
  const onModalOK = () => {
    modalForm.validateFields().then((values: Store) => {
      const { name, component, icon, path, sort, description, func } = values;
      let args = {
        name: name,
        component: component,
        icon: icon,
        path: path,
        depth: depth,
        sort: sort,
        description: description,
        parentNumber: parentNumber,
        parentId: parentId,
        functionId: func
      };
      if (modalModel === 'create') {
        addMenu(args)
          .then(() => {
            message.success(intl.formatMessage({ id: 'function.add.user.success' }));
            setModalShow(false);
            getMenuList();
          })
          .catch((error: Error) =>
            notification.error({
              message: intl.formatMessage({ id: 'function.add.user.fail.message' }),
              description: `${intl.formatMessage({ id: 'function.add.user.fail.description' })} ${error}`
            })
          );
      } else {
        editMenu({ ...args, id: itemId })
          .then(() => {
            message.success(intl.formatMessage({ id: 'function.add.user.success' }));
            setModalShow(false);
            getMenuList();
          })
          .catch((error: Error) =>
            notification.error({
              message: intl.formatMessage({ id: 'function.add.user.fail.message' }),
              description: `${intl.formatMessage({ id: 'function.add.user.fail.description' })} ${error}`
            })
          );
      }
    });
  };
  const getMenuList = () => {
    getMenuTable().catch((error) => {
      notification.error({
        message: intl.formatMessage({ id: 'user.function.get.user.list.fail.message' }),
        description: `${intl.formatMessage({ id: 'user.function.get.user.list.fail.description' })} ${error}`
      });
    });
  };
  return (
    <PageContainer>
      <Card>
        <Button type="primary" style={{ marginBottom: 15 }} onClick={onCreateClick}>
          {intl.formatMessage({ id: 'user.button.create' })}
        </Button>
        <Table loading={LoadingObject(loading)} rowKey={(record) => record?.id!} tableLayout="fixed" size="small" dataSource={itemList} columns={columns}></Table>
      </Card>
      <Modal
        visible={modalShow}
        keyboard={false}
        maskClosable={false}
        title={intl.formatMessage({ id: modalTitle })}
        cancelText={intl.formatMessage({
          id: 'modal.cancel.text'
        })}
        okText={intl.formatMessage({
          id: 'modal.ok.text'
        })}
        destroyOnClose
        centered
        width={550}
        onCancel={() => {
          modalForm.resetFields();
          setModalShow(false);
        }}
        onOk={onModalOK}
      >
        <Form {...modalFormLayout} form={modalForm}>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'menu.modal.form.item.name.rule.message' })
              }
            ]}
            label={intl.formatMessage({ id: 'menu.modal.form.item.name.label' })}
          >
            <Input allowClear placeholder={intl.formatMessage({ id: 'menu.modal.form.item.name.input.placeholder' })} />
          </Form.Item>
          <Form.Item
            name="path"
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'menu.modal.form.item.path.rule.message' })
              }
            ]}
            label={intl.formatMessage({ id: 'menu.modal.form.item.path.label' })}
          >
            <Input allowClear placeholder={intl.formatMessage({ id: 'menu.modal.form.item.path.input.message' })} />
          </Form.Item>
          <Form.Item
            name="component"
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'menu.modal.form.item.component.rule.message' })
              }
            ]}
            label={intl.formatMessage({ id: 'menu.modal.form.item.component.label' })}
          >
            <Input allowClear placeholder={intl.formatMessage({ id: 'menu.modal.form.item.component.input.message' })} />
          </Form.Item>
          <Form.Item
            name="icon"
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'menu.modal.form.item.icon.rule.message' })
              }
            ]}
            label={intl.formatMessage({ id: 'menu.modal.form.item.icon.label' })}
          >
            <Input allowClear placeholder={intl.formatMessage({ id: 'menu.modal.form.item.icon.input.message' })} />
          </Form.Item>
          <Form.Item name="func" label={intl.formatMessage({ id: 'menu.modal.form.item.functions.label' })}>
            <Select mode="multiple" loading={roleLoading} placeholder={intl.formatMessage({ id: 'menu.modal.form.item.functions.select.placeholder' })}>
              {functions?.map((item: Types.FunctionSelect) => (
                <Select.Option key={item.value} value={item.value!}>
                  {item.text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="sort" label={intl.formatMessage({ id: 'menu.modal.form.item.sort.label' })}>
            <InputNumber placeholder={intl.formatMessage({ id: 'menu.modal.form.item.sort.input.message' })} />
          </Form.Item>
          <Form.Item name="description" label={intl.formatMessage({ id: 'menu.modal.form.item.description.label' })} style={{ marginBottom: 0 }}>
            <Input.TextArea allowClear placeholder={intl.formatMessage({ id: 'menu.modal.form.item.description.input.message' })} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Menu;
