//package com.greenpulse.greenpulse_backend.model;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//
//
//@NoArgsConstructor
//@AllArgsConstructor
//@Entity
//@Table(name = "Roles")
//public class Roles {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name="role_id")
//    private int roleId;
//
//
//    private String roleName;
//
//    public int getRoleId() {
//        return roleId;
//    }
//
//    public String getRoleName() {
//        return roleName;
//    }
//
//    public void setRoleId(int roleId) {
//        this.roleId = roleId;
//    }
//
//    public void setRoleName(String roleName) {
//        this.roleName = roleName;
//    }
//}
