package uk.co.scottlogic.gradProject.server.repos.documents;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

import java.util.Objects;
import java.util.UUID;
import org.junit.Before;
import org.junit.Test;

public class CategoryTest {

  @Before
  public void setUp() throws Exception {
  }

  @Test
  public void categoryEmptyCreation() throws Exception {
    Category c = new Category();
  }

  @Test(expected = IllegalArgumentException.class)
  public void categoryWithAsteriskShouldNotBeCreated() {
    Category c = new Category("*");
  }

  @Test(expected = IllegalArgumentException.class)
  public void categoryWithHyphonShouldNotBeCreated() {
    Category c = new Category("-");
  }

  @Test(expected = IllegalArgumentException.class)
  public void categoryWithUnderscoreShouldNotBeCreated() {
    Category c = new Category("_");
  }

  @Test(expected = IllegalArgumentException.class)
  public void categoryWithEmojiShouldNotBeCreated() {
    Category c = new Category("🖤");
  }

  @Test
  public void settingCategoryDescriptionShouldChange() {
    Category c = new Category("category");
    String descriptionToSet = "hello";
    c.setDescription(descriptionToSet);
    assertEquals(c.getDescription(), descriptionToSet);
  }

  @Test
  public void settingCategoryUUIDShouldChangeIt() {
    Category c = new Category("category");
    UUID id = UUID.randomUUID();
    c.setId(id);
    assertEquals(c.getId(), id);
  }

  @Test
  public void checkCategoryEqualityWhereUUIDisDifferent() {
    Category c = new Category("category");
    Category d = new Category("category");
    assertNotEquals("Categories are equal", c.equals(d));
  }

  @Test
  public void checkCategoryEqualitySameUUID() {
    Category c = new Category("category");
    Category d = new Category("category");
    UUID id = UUID.randomUUID();
    c.setId(id);
    d.setId(id);
    assertEquals(c, d);
    assertEquals(c, c);
    ApplicationUser x = new ApplicationUser();
    assertNotEquals(c, x);
  }

  @Test
  public void checkCategoryIsEqual() {
    Category c = new Category("category");
    UUID id = UUID.randomUUID();
    String descriptionToSet = "hello";
    c.setId(id);
    c.setDescription(descriptionToSet);
    int hash = Objects.hash(id, descriptionToSet);
    assertEquals(c.hashCode(), hash);
  }

  @Test
  public void checkCategoryShouldNotEqual() {
    Category c = new Category("category");
    UUID id = UUID.randomUUID();
    String descriptionToSet = "hello";
    String descriptionToCompare = "hello1";
    c.setId(id);
    c.setDescription(descriptionToSet);
    int hash = Objects.hash(id, descriptionToCompare);
    assertNotEquals(c.hashCode(), hash);
  }

}