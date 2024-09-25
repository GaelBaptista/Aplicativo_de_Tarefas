import { View, Text, FlatList, Modal, TextInput } from "react-native";
import { Checkbox, Card, Button, Avatar, IconButton } from "react-native-paper";

import Notifications from "expo-notifications";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TaskScreen = () => {
  const [tasks, setTasks] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [newTask, setNewTask] = React.useState({
    title: "",
    description: "",
    time: "",
    completed: false,
    deadline: new Date(),
    users: [],
  });

  React.useEffect(() => {
    loadTasksFromStorage();
  }, []);

  const loadTasksFromStorage = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Erro ao carregar tarefas: ", error);
    }
  };

  // Função para salvar tarefas no AsyncStorage
  const saveTasksToStorage = async (tasks) => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Erro ao salvar tarefas: ", error);
    }
  };

  // Função para adicionar uma nova tarefa
  const addNewTask = () => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
    setModalVisible(false);
    setNewTask({
      title: "",
      description: "",
      time: "",
      completed: false,
      deadline: new Date(),
      users: [],
    });
  };

  // Função para marcar tarefa como completa/incompleta
  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  const renderTask = ({ item }) => (
    <Card style={{ marginVertical: 10, marginHorizontal: 20 }}>
      <Card.Content>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {item.title}
            </Text>
            <Text>{item.description}</Text>
            <Text>{item.time}</Text>
            <Text>Prazo: {new Date(item.deadline).toLocaleDateString()}</Text>
          </View>
          <Checkbox
            status={item.completed ? "checked" : "unchecked"}
            onPress={() => toggleTaskCompletion(item.id)}
          />
        </View>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          {item.users.map((user, index) => (
            <Avatar.Image
              key={index}
              size={32}
              source={{ uri: user }}
              style={{ marginRight: 5 }}
            />
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  // Função para agendar notificações
  const schedulePushNotification = async (deadline) => {
    const schedulingOptions = {
      content: {
        title: "Lembrete de tarefa!",
        body: "Sua tarefa está se aproximando do prazo.",
      },
      trigger: {
        date: new Date(deadline.getTime() - 60 * 60 * 1000), // 1 hora antes do prazo
      },
    };
    await Notifications.scheduleNotificationAsync(schedulingOptions);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || newTask.deadline;
    setNewTask({ ...newTask, deadline: currentDate });
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        transparent
      >
        <View style={{ backgroundColor: "white", margin: 20, padding: 20 }}>
          <Text>Título:</Text>
          <TextInput
            value={newTask.title}
            onChangeText={(text) => setNewTask({ ...newTask, title: text })}
            placeholder="Título da Tarefa"
          />
          <Text>Descrição:</Text>
          <TextInput
            value={newTask.description}
            onChangeText={(text) =>
              setNewTask({ ...newTask, description: text })
            }
            placeholder="Descrição"
          />
          <Text>Prazo:</Text>
          <DateTimePicker
            value={newTask.deadline}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
          <Button onPress={addNewTask}>Adicionar Tarefa</Button>
          <Button onPress={() => setModalVisible(false)}>Cancelar</Button>
        </View>
      </Modal>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>Today's Task</Text>
        <IconButton
          icon="plus"
          size={24}
          onPress={() => setModalVisible(true)}
        />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTask}
      />
    </View>
  );
};

export default TaskScreen;
