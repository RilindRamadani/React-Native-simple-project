import { useSelector, useLayoutEffect, useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useDispatch } from "react-redux";
import IconButton from "../components/IconButton";
import List from "../components/MealDetail/List";
import Subtitle from "../components/MealDetail/Subtitle";
import MealDetails from "../components/MealDetails";
import { MEALS } from "../data/dummy-data";
import images from "../assets/images.json";
import { priceReducerActions } from "../store/store";

function MealDetailScreen({ route, navigation }) {
  const mealId = route.params.mealId;
  const [selectedMeal, setSelectedMeal] = useState(undefined);
  const [starPressed, setStarPressed] = useState(false);
  const [starPressedColor, setStarPressedColor] = useState("white");
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchSelectedMeal() {
      const meals = await MEALS;
      const meal = meals.find((meal) => {
        return meal.id == mealId;
      });

      setSelectedMeal(meal);
    }
    fetchSelectedMeal();
  }, [mealId]);

  function headerButtonPressHandler() {
    const selectedMealName = selectedMeal.title;

    const flippedStarPressed = !starPressed;
    setStarPressed(flippedStarPressed);

    setStarPressedColor((prevStateColor) =>
      prevStateColor === "white" ? "yellow" : "white"
    );

    if (flippedStarPressed) {
      dispatch(priceReducerActions.addMeal(selectedMealName));
    } else {
      dispatch(priceReducerActions.removeMeal(selectedMealName));
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <IconButton
            icon="star"
            color={starPressedColor}
            onPress={headerButtonPressHandler}
          />
        );
      },
    });
  }, [navigation, headerButtonPressHandler]);

  if (!selectedMeal) {
    return <Text style={styles.loadingText}>Component is loading...</Text>;
  }

  return (
    <ScrollView style={styles.rootContainer}>
      <Image style={styles.image} source={{ uri: selectedMeal.imageUrl }} />
      <Text style={styles.title}>{selectedMeal.title}</Text>
      <MealDetails
        duration={selectedMeal.Time}
        complexity={selectedMeal.complexity}
        price={selectedMeal.price}
        textStyle={styles.detailText}
      />
      <View style={styles.listOuterContainer}>
        <View style={styles.listContainer}>
          <Subtitle>Ingredients</Subtitle>
          <List data={selectedMeal.ingredients} />
          <Subtitle>Steps</Subtitle>
          <List data={selectedMeal.steps} />
        </View>
      </View>
    </ScrollView>
  );
}

export default MealDetailScreen;

const styles = StyleSheet.create({
  rootContainer: {
    marginBottom: 32,
  },
  image: {
    width: "100%",
    height: 350,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    margin: 8,
    textAlign: "center",
    color: images.colors.solidBlack,
  },
  detailText: {
    color: images.colors.lightBlack,
  },
  listOuterContainer: {
    alignItems: "center",
  },
  listContainer: {
    width: "80%",
  },
});
