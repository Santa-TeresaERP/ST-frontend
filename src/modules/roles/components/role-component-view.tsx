"use client";

import React from "react";
import { useFetchRoles } from "@/modules/roles/hook/useRoles";
import { Table } from "antd";
import { Role } from "@/modules/roles/types/roles";

const RoleList: React.FC = () => {
  const { data: roles, isLoading, error } = useFetchRoles();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  const expandedRowRender = (role: Role) => {
    return (
      <Table
        dataSource={role.Permissions}
        rowKey="id"
        pagination={false}
      >
        <Table.Column title="Módulo" dataIndex={["Module", "name"]} key="module" />
        <Table.Column title="Descripción del Módulo" dataIndex={["Module", "description"]} key="moduleDescription" />
        <Table.Column title="Leer" dataIndex="canRead" key="canRead" render={(canRead: boolean) => (canRead ? "Sí" : "No")} />
        <Table.Column title="Escribir" dataIndex="canWrite" key="canWrite" render={(canWrite: boolean) => (canWrite ? "Sí" : "No")} />
        <Table.Column title="Editar" dataIndex="canEdit" key="canEdit" render={(canEdit: boolean) => (canEdit ? "Sí" : "No")} />
        <Table.Column title="Eliminar" dataIndex="canDelete" key="canDelete" render={(canDelete: boolean) => (canDelete ? "Sí" : "No")} />
      </Table>
    );
  };

  return (
    <Table
      dataSource={roles}
      rowKey="id"
      expandable={{ expandedRowRender }}
    >
      <Table.Column title="Nombre" dataIndex="name" key="name" />
      <Table.Column title="Descripción" dataIndex="description" key="description" />
    </Table>
  );
};

export default RoleList;