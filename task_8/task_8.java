package com.employee.repository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;
import com.employee.model.Employee;
@Component
public class EmployeeRepository {
 private List<Employee> employeeList = new ArrayList<>();
 public void addEmployee(Employee employee) {
 employeeList.add(employee);
 }
 public List<Employee> getAllEmployees() {
 return employeeList;
 }
}
package com.employee.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.employee.model.Employee;
import com.employee.repository.EmployeeRepository;
@Component
public class EmployeeService {
 @Autowired
 private EmployeeRepository repository;
 public void createEmployee(int id, String name, String dept) {
 Employee emp = new Employee(id, name, dept);
 repository.addEmployee(emp);
 }
 public void displayEmployees() {
 for (Employee emp : repository.getAllEmployees()) {
 System.out.println(emp.getId() + " " +
 emp.getName() + " " +
 emp.getDepartment());
 }
 }
}
beans.xml
<beans xmlns="http://www.springframework.org/schema/beans"
 xmlns:context="http://www.springframework.org/schema/context"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="
 http://www.springframework.org/schema/beans
 http://www.springframework.org/schema/beans/spring-beans.xsd
 http://www.springframework.org/schema/context
 http://www.springframework.org/schema/context/springcontext.xsd">
 <context:component-scan base-package="com.employee"/>
</beans>
MainApp.java
package com.employee.main;
import org.springframework.beans.factory.BeanFactory;
import
org.springframework.context.support.ClassPathXmlApplicationContext;
import com.employee.service.EmployeeService;
public class MainApp {
 public static void main(String[] args) {
 BeanFactory factory =
 new ClassPathXmlApplicationContext("beans.xml");
 EmployeeService service =
 factory.getBean(EmployeeService.class);
 service.createEmployee(101, "Arun", "IT");
 service.createEmployee(102, "Priya", "HR");
 service.displayEmployees();
 }
}
