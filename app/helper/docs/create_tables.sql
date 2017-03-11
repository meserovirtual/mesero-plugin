# HELPERS
CREATE TABLE helpers (
  helper_id      	INT(11)      NOT NULL AUTO_INCREMENT,
  producto_id     INT(11)      NOT NULL,
  cant_actual		  INT(11)      NOT NULL,
  cant_vendida 		INT(11)      NOT NULL,
  cant_post_vent	INT(11)      NOT NULL,
  fecha         	TIMESTAMP    DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (helper_id)
)
  ENGINE = MyISAM
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8;